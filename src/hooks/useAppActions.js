import {
  createSheet,
  addSheetToDb,
  removeSheetFromDb,
  updateSheetNameInDb,
  addMetricToDb,
  updateMetricInDb,
  removeMetricFromDb,
  moveSheetInDb,
} from "../utils/sheetUtils";

import {
  updateEntryInDb,
  updateNgEntryInDb,
  updateNoteInDb,
  clearEntryInDb,
} from "../utils/monthDataUtils";

import {
  addNgTypeToDb,
  updateNgTypeInDb,
  removeNgTypeFromDb,
} from "../utils/ngUtils";

import {
  deleteProductionNgType,
  deleteProductionMetric,
  deleteProductionDay,
  deleteProductionSheet,
} from "../services/supabaseWriteService";


export function useAppActions({
  setDb,
  setSheetId,
  sheetId,
  mk,
  scheduleSave,
  saveScheduler,
}) {

  /* ================================
     NG TYPE
  ================================= */

  const addNgType = (sId, name) => {
    setDb((prev) => {
      const next = addNgTypeToDb(
        prev,
        sId,
        name
      );

      scheduleSave(next);

      return next;
    });
  };


  const updateNgType = (
    sId,
    ngTypeId,
    name
  ) => {
    setDb((prev) => {
      const next = updateNgTypeInDb(
        prev,
        sId,
        ngTypeId,
        name
      );

      scheduleSave(next);

      return next;
    });
  };


  const removeNgType = async (
    sId,
    ngTypeId
  ) => {

    try {

      /*
       * Pastikan autosave sebelumnya selesai
       * sebelum melakukan DELETE.
       */
      await saveScheduler?.flush();

      /*
       * DELETE eksplisit di database.
       */
      await deleteProductionNgType(
        ngTypeId
      );

      /*
       * Setelah database berhasil dihapus,
       * baru update state React.
       */
      setDb((prev) =>
        removeNgTypeFromDb(
          prev,
          sId,
          ngTypeId
        )
      );

    } catch (error) {

      console.error(
        "REMOVE NG TYPE ERROR:",
        error
      );

      throw error;
    }
  };


  /* ================================
     PRODUCTION ENTRY
  ================================= */

  const updateEntry = (
    sId,
    d,
    metricId,
    field,
    raw
  ) => {
    setDb((prev) => {
      const next = updateEntryInDb(
        prev,
        mk,
        sId,
        d,
        metricId,
        field,
        raw
      );

      scheduleSave(next);

      return next;
    });
  };


  /* ================================
     NG DAILY ENTRY
  ================================= */

  const updateNgEntry = (
    sId,
    d,
    ngTypeId,
    raw
  ) => {
    setDb((prev) => {
      const next = updateNgEntryInDb(
        prev,
        mk,
        sId,
        d,
        ngTypeId,
        raw
      );

      scheduleSave(next);

      return next;
    });
  };


  /* ================================
     DAILY NOTE
  ================================= */

  const updateNote = (
    sId,
    d,
    note
  ) => {
    setDb((prev) => {
      const next = updateNoteInDb(
        prev,
        mk,
        sId,
        d,
        note
      );

      scheduleSave(next);

      return next;
    });
  };


  /* ================================
     CLEAR DAILY ENTRY
  ================================= */

  const clearEntry = async (
    sId,
    d
  ) => {

    try {

      /*
       * Tunggu autosave yang mungkin masih berjalan.
       */
      await saveScheduler?.flush();

      /*
       * DELETE hanya untuk sheet + tanggal
       * yang dipilih user.
       */
      await deleteProductionDay(
        sId,
        d
      );

      /*
       * Setelah database berhasil,
       * hapus tanggal tersebut dari state lokal.
       */
      setDb((prev) =>
        clearEntryInDb(
          prev,
          mk,
          sId,
          d
        )
      );

    } catch (error) {

      console.error(
        "CLEAR DAILY ENTRY ERROR:",
        error
      );

      throw error;
    }
  };


  /* ================================
     SHEET
  ================================= */

  const addSheet = (name) => {

    const s = createSheet(name);

    setDb((prev) => {
      const next = addSheetToDb(
        prev,
        s
      );

      scheduleSave(next);

      return next;
    });

    setSheetId(s.id);
  };


  const removeSheet = async (
    sId
  ) => {

    try {

      /*
       * Pastikan tidak ada snapshot lama
       * yang sedang menunggu disimpan.
       */
      await saveScheduler?.flush();

      /*
       * DELETE seluruh sheet secara eksplisit.
       * Foreign key CASCADE akan menangani
       * data turunannya.
       */
      await deleteProductionSheet(
        sId
      );

      /*
       * Setelah database berhasil,
       * baru update state lokal.
       */
      setDb((prev) => {

        const next = removeSheetFromDb(
          prev,
          sId
        );

        if (
          sheetId === sId &&
          next.sheets.length
        ) {
          setSheetId(
            next.sheets[0].id
          );
        }

        return next;
      });

    } catch (error) {

      console.error(
        "REMOVE SHEET ERROR:",
        error
      );

      throw error;
    }
  };


  const updateSheetName = (
    sId,
    name
  ) => {
    setDb((prev) => {
      const next = updateSheetNameInDb(
        prev,
        sId,
        name
      );

      scheduleSave(next);

      return next;
    });
  };


  /* ================================
     METRIC
  ================================= */

  const addMetric = (
    sId
  ) => {
    setDb((prev) => {
      const next = addMetricToDb(
        prev,
        sId
      );

      scheduleSave(next);

      return next;
    });
  };


  const updateMetric = (
    sId,
    mId,
    field,
    value
  ) => {
    setDb((prev) => {
      const next = updateMetricInDb(
        prev,
        sId,
        mId,
        field,
        value
      );

      scheduleSave(next);

      return next;
    });
  };


  const removeMetric = async (
    sId,
    mId
  ) => {

    try {

      /*
       * Pastikan autosave selesai.
       */
      await saveScheduler?.flush();

      /*
       * DELETE metric secara eksplisit.
       */
      await deleteProductionMetric(
        mId
      );

      /*
       * Setelah database berhasil,
       * update state lokal.
       */
      setDb((prev) =>
        removeMetricFromDb(
          prev,
          sId,
          mId
        )
      );

    } catch (error) {

      console.error(
        "REMOVE METRIC ERROR:",
        error
      );

      throw error;
    }
  };


  /* ================================
     SHEET ORDER
  ================================= */

  const moveSheet = (
    sId,
    direction
  ) => {
    setDb((prev) => {
      const next = moveSheetInDb(
        prev,
        sId,
        direction
      );

      scheduleSave(next);

      return next;
    });
  };


  /* ================================
     RETURN ACTIONS
  ================================= */

  return {

    // Production
    updateEntry,

    // NG
    updateNgEntry,
    addNgType,
    updateNgType,
    removeNgType,

    // Daily
    updateNote,
    clearEntry,

    // Sheet
    addSheet,
    removeSheet,
    updateSheetName,
    moveSheet,

    // Metric
    addMetric,
    updateMetric,
    removeMetric,
  };
}
