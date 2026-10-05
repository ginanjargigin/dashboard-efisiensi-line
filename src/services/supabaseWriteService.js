import { supabase } from "./supabaseClient";


/* =========================================================
   AUTOSAVE
========================================================= */

export async function saveDbToSupabase(db) {
  const { data, error } = await supabase.rpc(
    "sync_production_snapshot",
    {
      p_db: db,
    }
  );

  if (error) {
    throw new Error(
      `Supabase sync gagal: ${error.message}`
    );
  }

  console.log(
    "SUPABASE RPC SYNC SUCCESS:",
    data
  );

  return data;
}


/* =========================================================
   DELETE NG TYPE
========================================================= */

export async function deleteProductionNgType(
  ngTypeId
) {
  const { data, error } = await supabase.rpc(
    "delete_production_ng_type",
    {
      p_ng_type_id: ngTypeId,
    }
  );

  if (error) {
    throw new Error(
      `Gagal menghapus karakteristik NG: ${error.message}`
    );
  }

  return data;
}


/* =========================================================
   DELETE METRIC
========================================================= */

export async function deleteProductionMetric(
  metricId
) {
  const { data, error } = await supabase.rpc(
    "delete_production_metric",
    {
      p_metric_id: metricId,
    }
  );

  if (error) {
    throw new Error(
      `Gagal menghapus metric: ${error.message}`
    );
  }

  return data;
}


/* =========================================================
   DELETE PRODUCTION DAY
========================================================= */

export async function deleteProductionDay(
  sheetId,
  date
) {
  const { data, error } = await supabase.rpc(
    "delete_production_day",
    {
      p_sheet_id: sheetId,
      p_tanggal: date,
    }
  );

  if (error) {
    throw new Error(
      `Gagal menghapus data tanggal: ${error.message}`
    );
  }

  return data;
}


/* =========================================================
   DELETE SHEET / LINE
========================================================= */

export async function deleteProductionSheet(
  sheetId
) {
  const { data, error } = await supabase.rpc(
    "delete_production_sheet",
    {
      p_sheet_id: sheetId,
    }
  );

  if (error) {
    throw new Error(
      `Gagal menghapus line: ${error.message}`
    );
  }

  return data;
}
