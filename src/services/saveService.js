export function createSaveScheduler({
  saveDb,
  setSaveState,
  delay = 600,
}) {
  let timer = null;
  let pendingDb = null;
  let saving = false;

  let resolveIdle = null;

  const runSave = async (db) => {
    saving = true;

    try {
      await saveDb(db);
      setSaveState("saved");
    } catch {
      setSaveState("error");
    } finally {
      saving = false;

      if (pendingDb) {
        const nextDb = pendingDb;
        pendingDb = null;

        await runSave(nextDb);
        return;
      }

      setTimeout(() => {
        setSaveState("idle");
      }, 1500);

      if (resolveIdle) {
        const resolve = resolveIdle;
        resolveIdle = null;
        resolve();
      }
    }
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

        if (!dbToSave) return;

        runSave(dbToSave);
      }, delay);
    },

    async flush() {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }

      if (!saving && !pendingDb) {
        return;
      }

      if (!saving && pendingDb) {
        const dbToSave = pendingDb;
        pendingDb = null;

        await runSave(dbToSave);
        return;
      }

      await new Promise((resolve) => {
        resolveIdle = resolve;
      });
    },

    cancel() {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }

      pendingDb = null;
    },
  };
}
