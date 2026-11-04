import { Download, FileJson, FileSpreadsheet, Upload } from "lucide-react";
import AppLayout from "../components/AppLayout";
import PageHeading from "../components/PageHeading";
import { PixelButton } from "../components/PixelUI";
import { useLibrary } from "../context/LibraryContext";

export default function ImportExportPage() {
  const { items, loading } = useLibrary();
  function download(type) {
    const content = type === "json" ? JSON.stringify(items, null, 2) : ["title,creator,category,status,rating,year", ...items.map(x => [x.title,x.creator,x.category,x.status,x.rating,x.year].map(v => `"${String(v ?? "").replaceAll('"','""')}"`).join(","))].join("\n");
    const blob = new Blob([content], { type: type === "json" ? "application/json" : "text/csv" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `paracosm-library.${type}`; a.click(); URL.revokeObjectURL(url);
  }
  return <AppLayout><PageHeading eyebrow="YOUR DATA BELONGS TO YOU" title="Import & export" description="Download a backup of the entries in your private Paracosm library."/><div className="export-grid"><div className="export-card"><FileJson size={27}/><h3>JSON BACKUP</h3><p>Export your media entries and their fields in a structured JSON file.</p><PixelButton disabled={loading} onClick={()=>download("json")}><Download size={14}/> DOWNLOAD JSON</PixelButton></div><div className="export-card"><FileSpreadsheet size={27}/><h3>CSV SPREADSHEET</h3><p>Export a spreadsheet-friendly list of your titles, creators, categories and ratings.</p><PixelButton disabled={loading} onClick={()=>download("csv")}><Download size={14}/> DOWNLOAD CSV</PixelButton></div><div className="export-card export-muted"><Upload size={27}/><h3>IMPORT A LIBRARY</h3><p>CSV import and tracker migration are not available yet.</p><button className="button button-secondary" disabled>COMING LATER</button></div></div></AppLayout>;
}
