import { Link } from "react-router-dom";
import { ArrowUpRight, UserRound, Library, Download, Shield } from "lucide-react";
import AppLayout from "../components/AppLayout";
import PageHeading from "../components/PageHeading";

const options=[{to:"/settings/profile",icon:UserRound,title:"Profile",text:"Your display name, avatar and personal details."},{to:"/settings/library",icon:Library,title:"Library preferences",text:"Default views, sorting and category preferences."},{to:"/settings/import-export",icon:Download,title:"Import & export",text:"Take your archive with you using portable files."},{to:"/settings/account",icon:Shield,title:"Account & privacy",text:"Privacy preferences and account controls."}];
export default function SettingsPage(){return <AppLayout><PageHeading eyebrow="MAKE YOUR SPACE YOURS" title="Settings" description="Tweak your little corner of the internet."/><div className="settings-list">{options.map(({to,icon:Icon,title,text})=><Link to={to} className="settings-row" key={to}><span className="settings-icon"><Icon size={20}/></span><span className="settings-copy"><strong>{title}</strong><small>{text}</small></span><ArrowUpRight size={17}/></Link>)}</div></AppLayout>}
