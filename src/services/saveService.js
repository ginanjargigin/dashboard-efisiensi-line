export function createSaveScheduler({
  saveDb,
  setSaveState,
  delay = 600,
}) {
  let timer = null;
  let pendingDb = null;
  let saving = false;

  const idleWaiters = [];

  const resolveIdleWaiters = () => {
    if (saving || pendingDb) {
      return;
    }

    while (idleWaiters.length) {
      const resolve = idleWaiters.shift();
      resolve();
    }
  };

  const runSave = async (db) => {
    saving = true;

    try {
      await saveDb(db);
      setSaveState("saved");
    } catch (error) {
      setSaveState("error");
      throw error;
    } finally {
      saving = false;
    }

    if (pendingDb) {
      const nextDb = pendingDb;
      pendingDb = null;

      await runSave(nextDb);
      return;
    }

    setTimeout(() => {
      setSaveState("idle");
    }, 1500);

    resolveIdleWaiters();
  };

  return {
    schedule(nextDb) {
      setSaveState("saving");

      pendingDb = nextDb;

      if (saving) {
        return;
      }

      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(() => {
        timer = null;

        const dbToSave = pendingDb;
        pendingDb = null;

        if (!dbToSave) {
          resolveIdleWaiters();
          return;
        }

        runSave(dbToSave).catch(() => {
          /*
           * Error sudah ditangani oleh runSave()
           * melalui setSaveState("error").
           */
        });
      }, delay);
    },

    async flush() {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }

      /*
       * Tidak ada save yang sedang berjalan
       * dan tidak ada snapshot yang menunggu.
       */
      if (!saving && !pendingDb) {
        return;
      }

      /*
       * Ada snapshot yang menunggu tetapi
       * belum ada save yang berjalan.
       */
      if (!saving && pendingDb) {
        const dbToSave = pendingDb;
        pendingDb = null;

        await runSave(dbToSave);
        return;
      }

      /*
       * Save sedang berjalan.
       * Tunggu sampai seluruh antrean selesai.
       */
      await new Promise((resolve) => {
        idleWaiters.push(resolve);
      });
    },

    cancel() {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }

      pendingDb = null;
      resolveIdleWaiters();
    },
  };
}
