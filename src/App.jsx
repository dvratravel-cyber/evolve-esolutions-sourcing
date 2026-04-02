import { useState, useEffect, useRef } from "react";
import {
  Search, Mail, Bookmark, BookmarkCheck, Loader2, Sparkles,
  ArrowLeft, Copy, RefreshCw, AlertCircle, Phone, Linkedin,
  TrendingUp, Users, Globe, Zap, CheckCircle2, BarChart2,
  Target, Trash2, FileText, Settings, Download, Play, Square,
  Key, Database, Mic, LogOut, UserPlus, Shield, User, Eye,
  EyeOff, Clock, Activity, ChevronDown, ChevronRight, Tag
} from "lucide-react";

const ANTHROPIC_API   = "https://api.anthropic.com/v1/messages";
const S_USERS         = "evolve_users_v4";
const S_SESSION       = "evolve_session_v4";
const S_LEADS         = "evolve_leads_v4";
const S_SETTINGS      = "evolve_settings_v4";

const INDUSTRIES = ["Technology / SaaS","Financial Services","Healthcare","Legal","Manufacturing","E-commerce / Retail","Construction","Professional Services","Media & Marketing","Logistics & Supply Chain"];
const NICHES = [
  {id:"01",label:"Cloud & Infrastructure",       subs:["AWS (EKS / Lambda / CloudFormation)","Azure (AKS / Arc / Entra ID)","GCP (GKE / BigQuery / Anthos)","Terraform / Pulumi / CDK","Platform Engineering (Backstage / Port)","FinOps & Cost Governance","Observability (Datadog / Grafana)","Site Reliability Engineering (SRE)","Multi-Cloud Governance","Disaster Recovery Architecture"]},
  {id:"02",label:"DevOps & Platform Engineering",subs:["Kubernetes (EKS / AKS / GKE)","CI/CD (GitHub Actions / GitLab / Jenkins)","GitOps (ArgoCD / Flux)","Docker / Podman / containerd","IaC (Terraform / Pulumi / Crossplane)","Internal Developer Platforms (IDP)","DevSecOps (OPA / Checkov / Kyverno)","Release Engineering & Feature Flagging"]},
  {id:"03",label:"Cybersecurity",                subs:["Zero Trust Architecture","SIEM (Splunk / Sentinel / QRadar)","SOAR (Palo Alto / Tines)","Cloud Security (Wiz / Orca / Prisma)","IAM (Okta / CyberArk / SailPoint)","DevSecOps (SAST / DAST / SCA)","Penetration Testing & Red Teaming","LLM Security & AI Red Teaming","GRC (SOX / HIPAA / PCI-DSS / GDPR)"]},
  {id:"04",label:"Data & Analytics",             subs:["Databricks (Delta Live Tables / Lakehouse)","Snowflake (Cortex / Data Sharing)","dbt (Semantic Layer / dbt Cloud)","Apache Kafka / Flink / Spark","Data Mesh & Data Products","ETL/ELT (Fivetran / Airbyte)","Data Observability (Monte Carlo / Soda)","MLOps & Feature Stores","SQL / Python / Spark"]},
  {id:"05",label:"AI & Emerging Tech",           subs:["LLM Engineering (LangGraph / AutoGen / CrewAI)","RAG Architecture","Vector Databases (Pinecone / pgvector / Weaviate)","MLOps (MLflow / SageMaker / Vertex AI)","Fine-tuning (LoRA / QLoRA / PEFT)","AI Safety & Alignment","GPU Infrastructure & Model Serving","AI Observability (Arize / W&B)","Multimodal AI Engineering"]},
  {id:"06",label:"Software Engineering",         subs:["Backend (Java / Python / Go / Rust / Node.js)","Microservices & Distributed Systems","API Design (REST / GraphQL / gRPC)","Full Stack (React / Vue / Angular)","Domain-Driven Design (DDD)","AI Feature Integration (LLM APIs / RAG)","ERP/CRM (SAP / Salesforce / PeopleSoft)","Test-Driven Development (TDD / BDD)"]},
  {id:"07",label:"C-Suite & Technical Leadership",subs:["CTO — Chief Technology Officer","CIO — Chief Information Officer","CISO — Chief Information Security Officer","VP Engineering / Head of Engineering","CPO — Chief Product Officer","CDO — Chief Data Officer","Engineering Director / Principal Engineer","Head of Platform / Head of Architecture"]},
  {id:"08",label:"Fintech & Banking",            subs:["Payments Engineering (Stripe / Adyen / ISO 20022)","Open Banking (PSD2 / FDX / APIs)","Core Banking Modernisation","RegTech & Compliance Engineering","Blockchain & Digital Assets","Risk & Fraud Engineering","Trading Systems & Low Latency","Cloud-Native Banking Infrastructure"]},
  {id:"09",label:"Healthcare & MedTech",         subs:["FHIR / HL7 Integration Engineering","EHR/EMR Systems (Epic / Cerner / Meditech)","Clinical Data Engineering","Medical Device Software (IEC 62304)","HealthTech SaaS Platform Engineering","Digital Health & Telehealth","HIPAA Compliance Engineering","AI in Clinical Decision Support"]},
  {id:"10",label:"BioTech & Life Sciences",      subs:["Bioinformatics Engineering","Genomics & NGS Data Pipelines","Clinical Trial Data Management (CDISC)","Lab Informatics (LIMS / ELN)","Regulatory Affairs Technology","Drug Discovery AI & ML","Cell & Gene Therapy Tech","GxP Compliance & Validation"]},
  {id:"11",label:"Manufacturing & Industry 4.0", subs:["OT/IT Integration Engineering","SCADA & Industrial Control Systems","Digital Twin Architecture","Robotics & Automation Engineering","IoT Platform Engineering","Predictive Maintenance & AI","Battery Systems & EV Technology","Smart Factory & MES Systems"]},
  {id:"12",label:"Construction & Smart Infrastructure",subs:["BIM Engineering (Revit / Navisworks)","Digital Twin for Infrastructure","GIS & Geospatial Engineering","Smart Building & PropTech","Construction Tech Platform Engineering","Asset Management Systems","Project Controls Technology"]},
  {id:"13",label:"Telecoms",                     subs:["5G Network Engineering","Cloud-Native Network Functions (CNF)","Network Automation (Ansible / NSO)","OSS/BSS Platform Engineering","Edge Computing & MEC","Network Slicing & vRAN","Telco Cloud (OpenStack / VMware)","IP/MPLS Routing & Optical Networking"]},
  {id:"14",label:"SaaS & Startups",              subs:["Full Stack Engineering (Series A–C)","Platform & Infrastructure Engineering","Product-Led Growth Engineering","Developer Experience (DX)","API-First & Integration Engineering","AI Feature Engineering","Multi-Tenant SaaS Architecture","Staff / Principal Engineering Roles"]},
  {id:"15",label:"Retail & eCommerce",           subs:["eCommerce Platform Engineering (Shopify / Magento)","Payments & Checkout Engineering","Personalisation & Recommendation Engines","Warehouse Management Systems (WMS)","Supply Chain Technology","Omnichannel Engineering","A/B Testing & Experimentation Platforms","Retail AI & Computer Vision"]},
  {id:"16",label:"Aviation & Travel",            subs:["NDC API & Distribution Engineering","Revenue Management Systems","Airline Operations Technology","GDS Integration (Amadeus / Sabre / Travelport)","MRO & Fleet Management Systems","Travel Platform Engineering","Aviation Safety Systems","Baggage & Ground Ops Technology"]},
  {id:"17",label:"Insurance",                    subs:["InsurTech Platform Engineering","Policy Administration Systems","AI Underwriting & Pricing Models","Claims Automation Engineering","Telematics & IoT Insurance","Open Insurance & API Integration","Reinsurance Technology","Actuarial & Risk Modelling Systems"]},
  {id:"18",label:"Energy & Utilities",           subs:["Smart Grid Engineering","SCADA Modernisation","Energy Data Engineering","Renewable Energy Tech (Solar / Wind / Battery)","EV Charging Infrastructure","Energy Trading & ETRM Systems","Nuclear & Advanced Reactor Tech","Carbon Accounting & ESG Platforms"]},
];
const SIZES      = ["Startup (1–50)","SMB (51–250)","Mid-market (251–1000)","Enterprise (1000+)"];
const SIGNALS    = ["Recently funded","Actively posting jobs","Rapid headcount growth","New market expansion","Post-merger integration","Leadership change"];
const PALETTES   = ["bg-teal-100 text-teal-700","bg-blue-100 text-blue-700","bg-violet-100 text-violet-700","bg-amber-100 text-amber-700","bg-rose-100 text-rose-700","bg-cyan-100 text-cyan-700"];
const SEQ_TEMPLATES  = [
  {id:"fast",label:"Fast",days:"10d",steps:[{day:1,type:"email",label:"Cold intro"},{day:3,type:"email",label:"Follow-up"},{day:7,type:"email",label:"Value add"},{day:10,type:"email",label:"Break-up"}]},
  {id:"standard",label:"Standard",days:"2wk",steps:[{day:1,type:"email",label:"Cold intro"},{day:4,type:"email",label:"Follow-up #1"},{day:8,type:"email",label:"Case study"},{day:11,type:"email",label:"Value add"},{day:14,type:"email",label:"Break-up"}]},
  {id:"nurture",label:"Nurture",days:"3wk",steps:[{day:1,type:"email",label:"Cold intro"},{day:5,type:"email",label:"Follow-up #1"},{day:10,type:"email",label:"Case study"},{day:14,type:"email",label:"Value add"},{day:18,type:"call",label:"Call attempt"},{day:21,type:"email",label:"Break-up"}]},
];
const EMAIL_TYPES = [["intro","Cold intro"],["followup","Follow-up"],["casestudy","Case study"],["value","Value add"],["breakup","Break-up"]];
const DEFAULT_ADMIN   = {id:"evadmin",username:"evadmin",password:"evolve2024",displayName:"Admin",title:"Administrator",email:"admin@evolveesolutions.com",phone:"925-252-5700",role:"admin",createdAt:new Date().toISOString()};

// ── Storage ──
// ── Adaptive storage — window.storage in Claude.ai, localStorage on Vercel ──
async function sg(k){
  try{if(window.storage){const r=await window.storage.get(k);return r?JSON.parse(r.value):null;}}catch{}
  try{const v=localStorage.getItem(k);return v?JSON.parse(v):null;}catch{return null;}
}
async function ss(k,v){
  try{if(window.storage){await window.storage.set(k,JSON.stringify(v));return;}}catch{}
  try{localStorage.setItem(k,JSON.stringify(v));}catch{}
}

// ── Module-level API key (set once on load, used by all ai() calls) ──
let _anthropicKey="";

// ── Supabase config helpers ──
async function sbReq(url,key,method="GET",body=null,upsert=false){
  const prefer=upsert?"return=representation,resolution=merge-duplicates":"return=representation";
  const opts={method,headers:{"apikey":key,"Authorization":`Bearer ${key}`,"Content-Type":"application/json","Prefer":prefer}};
  if(body)opts.body=JSON.stringify(body);
  try{const r=await fetch(url,opts);if(!r.ok)return null;const t=await r.text();return t?JSON.parse(t):[];}catch{return null;}
}
async function loadConfigFromSB(url,key){
  if(!url||!key)return null;
  const rows=await sbReq(`${url}/rest/v1/config?select=*`,key);
  if(!rows?.length)return null;
  const out={};rows.forEach(r=>{try{out[r.key]=JSON.parse(r.value);}catch{out[r.key]=r.value;}});
  return out;
}
async function saveConfigToSB(url,key,configKey,value){
  if(!url||!key)return;
  await sbReq(`${url}/rest/v1/config?key=eq.${configKey}`,key,"DELETE");
  await sbReq(`${url}/rest/v1/config`,key,"POST",{key:configKey,value:JSON.stringify(value)});
}

// ── Supabase entity helpers ──
async function sbUpsert(url,key,table,record,conflict){
  try{
    const r=await fetch(`${url}/rest/v1/${table}?on_conflict=${conflict}`,{
      method:"POST",
      headers:{"apikey":key,"Authorization":`Bearer ${key}`,"Content-Type":"application/json","Prefer":"resolution=merge-duplicates,return=representation"},
      body:JSON.stringify(record)
    });
    return r.ok;
  }catch{return false;}
}
async function sbDeleteRow(url,key,table,column,value){
  try{await fetch(`${url}/rest/v1/${table}?${column}=eq.${encodeURIComponent(value)}`,{method:"DELETE",headers:{"apikey":key,"Authorization":`Bearer ${key}`}});}catch{}
}
async function sbGetAll(url,key,table){
  const rows=await sbReq(`${url}/rest/v1/${table}?select=*`,key);
  return rows||[];
}

// ── Supabase leads ──
async function sbLoadLeads(url,key){
  if(!url||!key)return null;
  const rows=await sbReq(`${url}/rest/v1/leads?select=*&order=created_at.asc`,key);
  if(!rows?.length)return null;
  return rows.map(r=>({...r.data,name:r.name,ownerId:r.owner_id,ownerName:r.owner_name}));
}
async function sbSaveLead(url,key,lead){
  if(!url||!key)return;
  await sbReq(`${url}/rest/v1/leads`,key,"POST",{name:lead.name,owner_id:lead.ownerId||"",owner_name:lead.ownerName||"",data:lead},true);
}
async function sbUpdateLead(url,key,lead){
  if(!url||!key)return;
  await sbReq(`${url}/rest/v1/leads?name=eq.${encodeURIComponent(lead.name)}`,key,"PATCH",{data:lead,owner_id:lead.ownerId||"",owner_name:lead.ownerName||""});
}
async function sbDeleteLead(url,key,name){
  if(!url||!key)return;
  await sbReq(`${url}/rest/v1/leads?name=eq.${encodeURIComponent(name)}`,key,"DELETE");
}

// ── Supabase enrichments ──
async function sbLoadEnrichment(url,key,slug){
  if(!url||!key)return null;
  const rows=await sbReq(`${url}/rest/v1/enrichments?slug=eq.${slug}&select=data`,key);
  return rows?.[0]?.data||null;
}
async function sbSaveEnrichment(url,key,slug,company,data){
  if(!url||!key)return;
  await sbReq(`${url}/rest/v1/enrichments`,key,"POST",{slug,company,data},true);
}

// ── Supabase contacts (verified only) ──
async function sbSaveContacts(url,key,leadName,contacts){
  if(!url||!key||!contacts?.length)return;
  // Delete old contacts for this lead first
  await sbReq(`${url}/rest/v1/contacts?lead_name=eq.${encodeURIComponent(leadName)}`,key,"DELETE");
  // Insert only contacts with at least a name
  const verified=contacts.filter(c=>c.name&&c.name!=="Unknown").map(c=>({
    lead_name:leadName,
    name:c.name||null,
    title:c.title||null,
    email:c.email&&c.email!=="Not found"?c.email:null, // null if not found/verified
    email_type:c.emailType||null,
    phone:c.phone&&c.phone!=="Not found"?c.phone:null, // null if not found
    phone_type:c.phoneType&&c.phoneType!=="Not found"?c.phoneType:null,
    linkedin:c.linkedin||null,
    source:c.source||"AI",
  }));
  if(verified.length) await sbReq(`${url}/rest/v1/contacts`,key,"POST",verified);
}

// ── Supabase outreach ──
async function sbSaveOutreach(url,key,leadName,ownerId,sequenceType,steps,campaignId=null){
  if(!url||!key)return;
  const record={lead_name:leadName,owner_id:ownerId,sequence_type:sequenceType,steps,instantly_campaign_id:campaignId||null};
  await sbReq(`${url}/rest/v1/outreach`,key,"POST",record,true);
}

// ── Apollo.io enrichment (via Vercel proxy — Apollo blocks direct browser calls) ──
async function apolloProxy(apiKey,target,body=null){
  const r=await fetch("/api/apollo",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({target,body,apiKey}),
  });
  const data=await r.json().catch(()=>({}));
  if(!r.ok)throw new Error(data.error||`Apollo error ${r.status}`);
  return data;
}
async function apolloEnrichCompany(domain,apiKey){
  if(!apiKey)throw new Error("No Apollo API key");
  return apolloProxy(apiKey,`/api/v1/organizations/enrich?domain=${domain}`);
}
async function apolloFindContacts(domain,apiKey){
  if(!apiKey)throw new Error("No Apollo API key");
  // Step 1: Search — q_organization_domains MUST be a string (not array) for api_search
  const searchRes=await apolloProxy(apiKey,"/api/v1/mixed_people/api_search",{
    q_organization_domains:domain,
    person_titles:["HR Director","Head of Talent","VP of Engineering","CTO","CIO","People Operations","Talent Acquisition","Technical Recruiter","Hiring Manager","Head of HR","Chief People Officer","VP HR","Director of Engineering","Head of People","Director of HR"],
    per_page:5,
    page:1,
  });
  const found=(searchRes?.people||[]).slice(0,3);
  if(!found.length)return {people:[]};
  // Step 2: Enrich each person with people/match to get full name + email
  // (api_search returns obfuscated last name and no email)
  const enriched=await Promise.all(found.map(async p=>{
    try{
      const res=await apolloProxy(apiKey,`/api/v1/people/match?id=${p.id}`);
      const ep=res?.person||{};
      const fullName=`${ep.first_name||p.first_name||""} ${ep.last_name||""}`.trim()||p.first_name||"Unknown";
      return {
        name:fullName,
        title:ep.title||p.title||"",
        email:ep.email||null,
        emailType:ep.email?.includes(domain)?"Work":"Personal",
        phone:ep.phone_numbers?.[0]?.raw_number||null,
        phoneType:ep.phone_numbers?.[0]?.type||null,
        linkedin:ep.linkedin_url||null,
        source:"Apollo",
      };
    }catch{
      // Fallback: use what we got from search (obfuscated name)
      return {
        name:p.first_name||"Unknown",
        title:p.title||"",
        email:null,phone:null,phoneType:null,linkedin:null,source:"Apollo",
      };
    }
  }));
  return {people:enriched};
}

// ── Instantly.ai v2 campaign push (via Vercel proxy to avoid CORS) ──
// Convert plain text email body to HTML so Instantly preserves line breaks and paragraphs
function emailToHtml(text){
  if(!text)return "";
  return text
    .split(/\n\n+/) // split on blank lines = paragraph breaks
    .map(para=>`<p>${para.replace(/\n/g,"<br>")}</p>`) // single newlines = <br>
    .join("");
}
// NOTE: Requires a v2 API key — Instantly → Settings → API Keys → Create Key (scopes: campaigns:all + leads:all)
async function instantlyProxy(apiKey,target,body,method="POST"){
  const r=await fetch("/api/instantly",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({target,body,apiKey,method}),
  });
  const text=await r.text();
  let d={};try{d=JSON.parse(text);}catch{}
  if(!r.ok)throw new Error(d.error||d.message||`Instantly ${r.status}: ${text.slice(0,200)}`);
  return d;
}
async function instantlyCreateCampaign(apiKey,campaignName,contacts,emailSteps){
  if(!apiKey)throw new Error("No Instantly v2 API key — generate one at Instantly → Settings → API Keys");
  if(!emailSteps?.length)throw new Error("No email steps to push");

  // Build sequences: delay = days interval between steps (not absolute day)
  // emailSteps[i].day is absolute day, so interval = day[i] - day[i-1]
  const steps=emailSteps.map((s,i)=>({
    type:"email",
    delay:i===0?0:Math.max(1,((emailSteps[i].day||1)-(emailSteps[i-1].day||1))),
    variants:[{subject:s.subject||"Following up",body:emailToHtml(s.body||"")}],
  }));

  // Step 1: Create campaign with sequences embedded (v2 format)
  const camp=await instantlyProxy(apiKey,"/api/v2/campaigns",{
    name:campaignName,
    campaign_schedule:{
      schedules:[{
        name:"Business Hours",
        timing:{from:"09:00",to:"17:00"},
        days:{"0":false,"1":true,"2":true,"3":true,"4":true,"5":true,"6":false}, // Mon-Fri
        timezone:"America/Dawson", // Pacific Time equivalent (America/Los_Angeles not in Instantly's allowed list)
      }],
    },
    sequences:[{steps}],
  });
  const campaignId=camp.id;
  if(!campaignId)throw new Error("Campaign created but no ID returned");

  // Step 2: Add contacts as leads (v2 — one per request)
  const validContacts=contacts.filter(c=>c.email&&c.email!=="Not found"&&c.email!==null);
  for(const contact of validContacts){
    await instantlyProxy(apiKey,"/api/v2/leads",{
      email:contact.email,
      first_name:contact.name?.split(" ")[0]||"",
      last_name:contact.name?.split(" ").slice(1).join(" ")||"",
      company_name:contact.company||"",
      campaign_id:campaignId,
    }).catch(e=>console.warn("Lead add failed:",e.message));
  }
  return campaignId;
}

// ── Claude AI ──
async function ai(prompt,search=false,maxTokens=1024){
  const headers={"Content-Type":"application/json","anthropic-dangerous-direct-browser-access":"true"};
  if(_anthropicKey){headers["x-api-key"]=_anthropicKey;headers["anthropic-version"]="2023-06-01";}
  const body={model:"claude-sonnet-4-5",max_tokens:maxTokens,messages:[{role:"user",content:prompt}]};
  if(search)body.tools=[{type:"web_search_20250305",name:"web_search"}];
  const r=await fetch(ANTHROPIC_API,{method:"POST",headers,body:JSON.stringify(body)});
  const d=await r.json();
  if(d.error)throw new Error(d.error.message||"API error");
  // Extract all text blocks (web search may interleave tool_use and text blocks)
  return d.content?.filter(b=>b.type==="text").map(b=>b.text).join("")||"";
}

// ── ElevenLabs ──
async function tts(text,key,voice="pNInz6obpgDQGcFmaJgB"){
  const r=await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}`,{method:"POST",headers:{"xi-api-key":key,"Content-Type":"application/json","Accept":"audio/mpeg"},body:JSON.stringify({text,model_id:"eleven_monolingual_v1",voice_settings:{stability:0.5,similarity_boost:0.75}})});
  if(!r.ok)throw new Error(`ElevenLabs ${r.status}`);
  return r.blob();
}

// ── Activity log ──
function addLog(lead,action,user){
  return{...lead,activityLog:[...(lead.activityLog||[]),{action,user:user.displayName,userId:user.username,timestamp:new Date().toISOString()}]};
}

// ── Shared UI ──
function Av({name,idx,lg,role}){
  const init=name.split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase();
  return <div className={`${lg?"w-12 h-12 text-base":"w-9 h-9 text-sm"} rounded-xl flex items-center justify-center font-semibold flex-shrink-0 ${PALETTES[idx%PALETTES.length]} relative`}>{init}{role==="admin"&&<span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center"><Shield size={8} className="text-white"/></span>}</div>;
}
function Score({s}){const c=s>=85?"bg-emerald-50 text-emerald-700 border-emerald-200":s>=70?"bg-amber-50 text-amber-700 border-amber-200":"bg-red-50 text-red-700 border-red-200";return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${c}`}>{s}</span>;}
function Pill({label,color="bg-slate-100 text-slate-600"}){return <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${color}`}>{label}</span>;}
function Chip({label,selected,onClick}){return <button onClick={onClick} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${selected?"bg-slate-800 text-white border-slate-800":"bg-white text-slate-600 border-slate-200 hover:border-slate-400"}`}>{label}</button>;}
function H1({title,sub}){return <div className="mb-6"><h1 className="text-xl font-semibold text-slate-800 mb-0.5">{title}</h1><p className="text-sm text-slate-500">{sub}</p></div>;}
function CtBadge({label}){const m={"Work":"bg-blue-50 text-blue-700","Personal":"bg-rose-50 text-rose-700","Direct":"bg-emerald-50 text-emerald-700","Mobile":"bg-violet-50 text-violet-700","Office":"bg-amber-50 text-amber-700","HQ":"bg-slate-100 text-slate-600"};return <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${m[label]||"bg-slate-100 text-slate-500"}`}>{label}</span>;}

// ── Activity Log Panel ──
function LogPanel({log=[]}){
  const [open,setOpen]=useState(false);
  if(!log.length)return null;
  const fmt=ts=>new Date(ts).toLocaleString("en-US",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"});
  const ic={saved:<Bookmark size={10}/>,enriched:<TrendingUp size={10}/>,discovered:<Search size={10}/>,"outreach generated":<Mail size={10}/>};
  return(
    <div className="mt-3 pt-3 border-t border-slate-100">
      <button onClick={()=>setOpen(p=>!p)} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600">
        <Activity size={11}/>{log.length} event{log.length!==1?"s":""}
        {open?<ChevronDown size={11}/>:<ChevronRight size={11}/>}
      </button>
      {open&&<div className="mt-2 space-y-1.5">{[...log].reverse().map((e,i)=><div key={i} className="flex items-center gap-2 text-xs text-slate-500"><span className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">{ic[e.action]||<Clock size={10}/>}</span><span className="font-medium text-slate-700">{e.user}</span><span>{e.action}</span><span className="ml-auto text-slate-400 flex-shrink-0">{fmt(e.timestamp)}</span></div>)}</div>}
    </div>
  );
}

// ── Instantly Tags ──
function InstantlyTags({user}){
  const [copied,setCopied]=useState("");
  const sig=`${user.displayName}\n${user.title||"Account Manager"}\nEvolve ESolutions\n${user.email||""} | ${user.phone||""}\nevolveesolutions.com`;
  const tags=[{key:"{{sender_name}}",val:user.displayName,lbl:"Sender name"},{key:"{{signature}}",val:sig,lbl:"Full signature"}];
  function cp(val,k){navigator.clipboard.writeText(val);setCopied(k);setTimeout(()=>setCopied(""),2000);}
  return(
    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-5">
      <div className="flex items-center gap-2 mb-3"><Tag size={13} className="text-indigo-500"/><span className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">Instantly.ai merge tags</span><span className="text-xs text-indigo-400">— paste into Instantly template fields</span></div>
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.map(t=><button key={t.key} onClick={()=>cp(t.key,t.key)} title={`Copies tag: ${t.key}\nValue: ${t.val}`} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-all ${copied===t.key?"bg-indigo-600 text-white border-indigo-600":"bg-white text-indigo-700 border-indigo-200 hover:border-indigo-400"}`}>{copied===t.key?<CheckCircle2 size={11}/>:<Copy size={11}/>}{t.key}</button>)}
        <button onClick={()=>cp(sig,"sig")} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${copied==="sig"?"bg-indigo-600 text-white border-indigo-600":"bg-white text-indigo-600 border-indigo-200 hover:border-indigo-400"}`}>{copied==="sig"?<CheckCircle2 size={11}/>:<Copy size={11}/>}Copy signature text</button>
      </div>
      <details><summary className="text-xs text-indigo-400 cursor-pointer hover:text-indigo-600">Preview your signature</summary><pre className="mt-2 text-xs text-indigo-800 bg-white border border-indigo-100 rounded-lg p-3 whitespace-pre-wrap font-sans">{sig}</pre></details>
      <p className="text-xs text-indigo-400 mt-2">Click any tag → copy it → paste into Instantly's template editor. Instantly auto-replaces with each sender's real details at send time.</p>
    </div>
  );
}

// ══ LOGIN ══
function Login({onLogin}){
  const [un,setUn]=useState("");const [pw,setPw]=useState("");const [show,setShow]=useState(false);const [err,setErr]=useState("");const [loading,setLoading]=useState(false);
  async function submit(){
    if(!un||!pw){setErr("Enter both fields.");return;}
    setLoading(true);setErr("");
    const users=await sg(S_USERS)||[DEFAULT_ADMIN];
    const u=users.find(x=>x.username===un.trim());
    if(!u){setErr("Username not found.");setLoading(false);return;}
    if(u.password!==pw){setErr("Incorrect password.");setLoading(false);return;}
    await ss(S_SESSION,{...u,password:undefined});
    onLogin(u);setLoading(false);
  }
  return(
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center mx-auto mb-4"><Sparkles size={22} className="text-white"/></div>
          <h1 className="text-xl font-semibold text-slate-800">Evolve <span className="text-indigo-600">ESolutions</span></h1>
          <p className="text-sm text-slate-500 mt-1">AI Client Sourcing Platform</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="mb-4">
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Username</label>
            <input type="text" value={un} onChange={e=>setUn(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="evadmin or evuser..." className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-400"/>
          </div>
          <div className="mb-5">
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Password</label>
            <div className="relative">
              <input type={show?"text":"password"} value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="••••••••" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-400 pr-10"/>
              <button onClick={()=>setShow(p=>!p)} className="absolute right-3 top-2.5 text-slate-400">{show?<EyeOff size={16}/>:<Eye size={16}/>}</button>
            </div>
          </div>
          {err&&<div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-100 rounded-xl px-3 py-2 mb-4"><AlertCircle size={14}/>{err}</div>}
          <button onClick={submit} disabled={loading} className="w-full py-3 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 flex items-center justify-center gap-2 disabled:opacity-60">{loading?<><Loader2 size={15} className="animate-spin"/>Signing in...</>:"Sign in"}</button>

        </div>

      </div>
    </div>
  );
}

// ── Tag Input ──
function TagInput({tags=[],onChange,placeholder="Type and press Enter"}){
  const [val,setVal]=useState("");
  function add(){
    const t=val.trim();
    if(!t||tags.includes(t))return;
    onChange([...tags,t]);setVal("");
  }
  function remove(t){onChange(tags.filter(x=>x!==t));}
  return(
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2 min-h-8">
        {tags.map(t=>(
          <span key={t} onClick={()=>remove(t)} title="Click to remove"
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800 text-white text-xs rounded-lg cursor-pointer hover:bg-red-500 transition-colors group">
            {t}<span className="opacity-50 group-hover:opacity-100 text-xs">✕</span>
          </span>
        ))}
        {tags.length===0&&<span className="text-xs text-slate-400 py-1">No sub-niches yet</span>}
      </div>
      <div className="flex gap-2">
        <input value={val} onChange={e=>setVal(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();add();}}}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-400"/>
        <button onClick={add} className="px-3 py-2 bg-indigo-600 text-white rounded-xl text-xs font-medium hover:bg-indigo-700">Add</button>
      </div>
      <p className="text-xs text-slate-400 mt-1">Press Enter or click Add · Click any tag to remove it</p>
    </div>
  );
}

// ── Niche & Industry Manager ──
function NicheIndustryManager({niches,industries,onSaveNiches,onSaveIndustries,settings}){
  const [tab,setTab]=useState("niches");
  const [nicheList,setNicheList]=useState(niches.map(n=>({...n,subs:[...(n.subs||[])]})));
  const [indList,setIndList]=useState([...industries]);
  const [selectedId,setSelectedId]=useState(nicheList[0]?.id||null);
  const [newNicheLabel,setNewNicheLabel]=useState("");
  const [newInd,setNewInd]=useState("");
  const [saving,setSaving]=useState(false);
  const [saved,setSaved]=useState(false);
  const [indInput,setIndInput]=useState("");

  const selected=nicheList.find(n=>n.id===selectedId);

  function updateSelected(field,val){
    setNicheList(p=>p.map(n=>n.id===selectedId?{...n,[field]:val}:n));
  }
  function addNiche(){
    if(!newNicheLabel.trim())return;
    const id=String(nicheList.length+1).padStart(2,"0");
    const n={id,label:newNicheLabel.trim(),subs:[]};
    setNicheList(p=>[...p,n]);
    setSelectedId(id);
    setNewNicheLabel("");
  }
  function deleteNiche(id){
    const next=nicheList.filter(n=>n.id!==id);
    setNicheList(next);
    setSelectedId(next[0]?.id||null);
  }
  function moveNiche(id,dir){
    const idx=nicheList.findIndex(n=>n.id===id);
    if(dir===-1&&idx===0)return;
    if(dir===1&&idx===nicheList.length-1)return;
    const next=[...nicheList];
    [next[idx],next[idx+dir]]=[next[idx+dir],next[idx]];
    setNicheList(next);
  }
  function addInd(){
    const t=indInput.trim();
    if(!t||indList.includes(t))return;
    setIndList(p=>[...p,t]);setIndInput("");
  }
  function removeInd(t){setIndList(p=>p.filter(x=>x!==t));}

  async function save(){
    setSaving(true);
    if(tab==="niches"){
      await onSaveNiches(nicheList);
    } else {
      await onSaveIndustries(indList);
    }
    setSaving(false);setSaved(true);setTimeout(()=>setSaved(false),2000);
  }

  return(
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      {/* Tab header */}
      <div className="flex border-b border-slate-100">
        {[["niches",`Niches (${nicheList.length})`],["industries",`Industries (${indList.length})`]].map(([t,lbl])=>(
          <button key={t} onClick={()=>setTab(t)} className={`flex-1 py-3 text-xs font-semibold transition-all ${tab===t?"bg-white text-slate-800 border-b-2 border-indigo-500":"bg-slate-50 text-slate-500 hover:text-slate-700"}`}>{lbl}</button>
        ))}
      </div>

      {/* Niches tab */}
      {tab==="niches"&&(
        <div className="flex" style={{minHeight:500}}>
          {/* Left — niche list */}
          <div className="w-56 border-r border-slate-100 flex flex-col flex-shrink-0">
            <div className="flex-1 overflow-y-auto">
              {nicheList.map((n,i)=>(
                <div key={n.id} className={`group flex items-center gap-1.5 px-3 py-2.5 cursor-pointer border-b border-slate-50 transition-all ${selectedId===n.id?"bg-indigo-50 border-l-2 border-l-indigo-500":"hover:bg-slate-50"}`} onClick={()=>setSelectedId(n.id)}>
                  <span className="text-xs text-slate-400 font-mono w-5 flex-shrink-0">{n.id}</span>
                  <span className={`text-xs flex-1 truncate font-medium ${selectedId===n.id?"text-indigo-700":"text-slate-700"}`}>{n.label}</span>
                  <div className="hidden group-hover:flex items-center gap-0.5">
                    <button onClick={e=>{e.stopPropagation();moveNiche(n.id,-1);}} className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded">↑</button>
                    <button onClick={e=>{e.stopPropagation();moveNiche(n.id,1);}} className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded">↓</button>
                    <button onClick={e=>{e.stopPropagation();deleteNiche(n.id);}} className="w-5 h-5 flex items-center justify-center text-red-400 hover:text-red-600 rounded">✕</button>
                  </div>
                </div>
              ))}
            </div>
            {/* Add niche */}
            <div className="p-3 border-t border-slate-100">
              <input value={newNicheLabel} onChange={e=>setNewNicheLabel(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addNiche()} placeholder="New niche name..." className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-400 mb-2"/>
              <button onClick={addNiche} className="w-full py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700">+ Add niche</button>
            </div>
          </div>

          {/* Right — edit selected niche */}
          <div className="flex-1 p-5 overflow-y-auto">
            {selected?(
              <>
                <div className="mb-4">
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Niche name</label>
                  <input value={selected.label} onChange={e=>updateSelected("label",e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-400 font-medium"/>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Sub-niches ({selected.subs?.length||0})</label>
                  <TagInput tags={selected.subs||[]} onChange={val=>updateSelected("subs",val)} placeholder="e.g. AWS EKS, Terraform, Kubernetes..."/>
                </div>
                <div className="mt-4 p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500">Sub-niches appear as filter chips on the Discover screen when this niche is selected. They make searches more targeted and feed into the outreach prompt.</p>
                </div>
              </>
            ):(
              <div className="flex items-center justify-center h-full text-slate-400 text-sm">Select a niche to edit</div>
            )}
          </div>
        </div>
      )}

      {/* Industries tab */}
      {tab==="industries"&&(
        <div className="p-5">
          <p className="text-xs text-slate-500 mb-4">Industries appear in the broad "Industry search" mode on Discover. Add, remove, or reorder them here.</p>
          <div className="flex flex-wrap gap-2 mb-4 min-h-12">
            {indList.map(ind=>(
              <span key={ind} onClick={()=>removeInd(ind)} title="Click to remove"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-sm text-slate-700 rounded-xl cursor-pointer hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-all group">
                {ind}<span className="opacity-40 group-hover:opacity-100 text-xs">✕</span>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={indInput} onChange={e=>setIndInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();addInd();}}}
              placeholder="e.g. PropTech, CleanTech..." className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-400"/>
            <button onClick={addInd} className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700">Add</button>
          </div>
          <p className="text-xs text-slate-400 mt-2">Click any industry to remove it · Press Enter to add</p>
        </div>
      )}

      {/* Save bar */}
      <div className="border-t border-slate-100 px-5 py-3 bg-slate-50 flex items-center justify-between">
        <p className="text-xs text-slate-400">{settings?.supabaseUrl?"Changes save to Supabase and apply immediately for all users.":"No Supabase connected — changes save locally only."}</p>
        <button onClick={save} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-medium hover:bg-slate-700 disabled:opacity-60">
          {saving?<><Loader2 size={12} className="animate-spin"/>Saving...</>:saved?<><CheckCircle2 size={12}/>Saved!</>:<>Save changes</>}
        </button>
      </div>
    </div>
  );
}

// ══ SETTINGS (admin only) ══
function SettingsView({settings,onSave,users,onAdd,onRemove,onPwReset,cu,niches,industries,onSaveNiches,onSaveIndustries}){
  const [settingsTab,setSettingsTab]=useState("keys");
  const [f,setF]=useState({anthropicKey:settings.anthropicKey||"",elevenLabsKey:settings.elevenLabsKey||"",elevenLabsVoiceId:settings.elevenLabsVoiceId||"pNInz6obpgDQGcFmaJgB",supabaseUrl:settings.supabaseUrl||"",supabaseKey:settings.supabaseKey||"",apolloKey:settings.apolloKey||"",instantlyV2Key:settings.instantlyV2Key||""});
  const [saved,setSaved]=useState(false);
  const [nu,setNu]=useState({username:"",displayName:"",title:"",email:"",phone:"",password:""});
  const [addErr,setAddErr]=useState("");
  const [pwState,setPwState]=useState({});
  function saveKeys(){onSave(f);setSaved(true);setTimeout(()=>setSaved(false),2000);}
  function addUser(){
    if(!nu.username||!nu.password){setAddErr("Username and password required.");return;}
    if(!nu.username.startsWith("evadmin")&&!nu.username.startsWith("evuser")){setAddErr("Must start with evadmin or evuser.");return;}
    if(users.find(u=>u.username===nu.username)){setAddErr("Username already taken.");return;}
    onAdd({...nu,role:nu.username.startsWith("evadmin")?"admin":"user",id:nu.username,createdAt:new Date().toISOString()});
    setNu({username:"",displayName:"",title:"",email:"",phone:"",password:""});setAddErr("");
  }
  const F=({lbl,k,ph,secret,hint})=><div className="mb-4"><label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">{lbl}</label><input type={secret?"password":"text"} value={f[k]} onChange={e=>setF(p=>({...p,[k]:e.target.value}))} placeholder={ph} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-slate-400 font-mono"/>{hint&&<p className="text-xs text-slate-400 mt-1">{hint}</p>}</div>;
  return(
    <div className="max-w-2xl mx-auto px-6 py-8">
      <H1 title="Settings" sub="Admin only — API keys, user management, and niche configuration."/>

      {/* Settings tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-slate-100 rounded-xl w-fit">
        {[["keys","API Keys"],["users","Users"],["niches","Niches & Industries"]].map(([t,lbl])=>(
          <button key={t} onClick={()=>setSettingsTab(t)} className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${settingsTab===t?"bg-white text-slate-800 shadow-sm":"text-slate-500 hover:text-slate-700"}`}>{lbl}</button>
        ))}
      </div>

      {/* API Keys tab */}
      {settingsTab==="keys"&&(
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4 flex items-center gap-1.5"><Key size={13}/>API Keys</h3>
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 mb-4 flex items-start gap-2">
              <AlertCircle size={13} className="text-indigo-500 mt-0.5 flex-shrink-0"/>
              <p className="text-xs text-indigo-700">On <span className="font-semibold">Vercel</span>, the Anthropic key is required for AI to work. In <span className="font-semibold">Claude.ai</span>, it's optional — AI runs automatically.</p>
            </div>
            <F lbl="Anthropic API key" k="anthropicKey" ph="sk-ant-..." secret hint="console.anthropic.com → API Keys — required on Vercel, optional in Claude.ai"/>
            <F lbl="ElevenLabs Voice ID" k="elevenLabsVoiceId" ph="pNInz6obpgDQGcFmaJgB" hint="Default: Adam. Find others at elevenlabs.io/voice-library"/>
            <F lbl="Supabase URL" k="supabaseUrl" ph="https://xxxx.supabase.co"/>
            <F lbl="Supabase anon key" k="supabaseKey" ph="eyJ..." secret/>
            <F lbl="Apollo.io API key" k="apolloKey" ph="..." secret hint="apollo.io → Settings → API Keys (coming soon)"/>
            <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-3">
              <p className="text-xs text-amber-700 font-semibold mb-1">⚠️ Instantly requires a v2 API key</p>
              <p className="text-xs text-amber-600">Go to Instantly → Settings → API Keys → Create API Key → select scopes: campaigns:all + leads:all → copy the key below.</p>
            </div>
            <F lbl="Instantly.ai API key (v2)" k="instantlyV2Key" ph="inst_v2_..." secret hint="Must be a v2 key — v1 keys will return Unauthorized"/>
            <button onClick={saveKeys} className="w-full py-2.5 rounded-xl bg-slate-800 text-white text-sm font-medium hover:bg-slate-700 flex items-center justify-center gap-2">{saved?<><CheckCircle2 size={14}/>Saved!</>:<><Key size={14}/>Save API keys</>}</button>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
            <h3 className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-3 flex items-center gap-1.5"><Database size={13}/>Supabase — run once in SQL editor</h3>
            <pre className="text-xs text-amber-900 bg-amber-100 rounded-lg p-3 overflow-x-auto whitespace-pre">{`create table if not exists leads (
  id uuid default gen_random_uuid() primary key,
  name text unique not null, owner_id text,
  owner_name text, data jsonb,
  created_at timestamptz default now()
);
create table if not exists enrichments (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null, company text,
  data jsonb, created_at timestamptz default now()
);
create table if not exists config (
  id uuid default gen_random_uuid() primary key,
  key text unique not null,
  value jsonb,
  updated_at timestamptz default now()
);`}</pre>
          </div>
        </div>
      )}

      {/* Users tab */}
      {settingsTab==="users"&&(
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4 flex items-center gap-1.5"><UserPlus size={13}/>Add user</h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              {[["Username","username","evuser_sarah or evadmin_tom"],["Display name","displayName","Sarah Chen"],["Job title","title","Account Manager"],["Email","email","sarah@evolveesolutions.com"],["Phone","phone","925-xxx-xxxx"],["Password","password","min 6 chars"]].map(([l,k,p])=><div key={k}><label className="block text-xs font-medium text-slate-500 mb-1">{l}</label><input type={k==="password"?"password":"text"} value={nu[k]} onChange={e=>setNu(p=>({...p,[k]:e.target.value}))} placeholder={p} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-slate-400"/></div>)}
            </div>
            {addErr&&<div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-100 rounded-xl px-3 py-2 mb-3"><AlertCircle size={12}/>{addErr}</div>}
            <button onClick={addUser} className="w-full py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 flex items-center justify-center gap-2"><UserPlus size={14}/>Create user</button>
            <p className="text-xs text-slate-400 mt-2"><code className="bg-slate-100 px-1 rounded">evadmin...</code> = admin · <code className="bg-slate-100 px-1 rounded">evuser...</code> = standard access</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4 flex items-center gap-1.5"><Users size={13}/>All users ({users.length})</h3>
            <div className="space-y-3">
              {users.map((u,i)=>(
                <div key={u.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <Av name={u.displayName||u.username} idx={i} role={u.role}/>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2"><span className="text-sm font-medium text-slate-800">{u.displayName||u.username}</span><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.role==="admin"?"bg-indigo-100 text-indigo-700":"bg-slate-100 text-slate-600"}`}>{u.role}</span></div>
                    <div className="text-xs text-slate-500">{u.username} · {u.title||"—"}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {pwState[u.id]?<div className="flex items-center gap-1"><input type="text" placeholder="new password" value={pwState[u.id]||""} onChange={e=>setPwState(p=>({...p,[u.id]:e.target.value}))} className="px-2 py-1 text-xs border border-slate-200 rounded-lg w-24 focus:outline-none"/><button onClick={()=>{onPwReset(u.id,pwState[u.id]);setPwState(p=>({...p,[u.id]:""}));}} className="px-2 py-1 text-xs bg-slate-800 text-white rounded-lg">Set</button><button onClick={()=>setPwState(p=>({...p,[u.id]:undefined}))} className="px-2 py-1 text-xs border border-slate-200 rounded-lg">✕</button></div>:<button onClick={()=>setPwState(p=>({...p,[u.id]:""}))} className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 border border-slate-200 rounded-lg">Reset pw</button>}
                    {u.username!=="evadmin"&&u.username!==cu.username&&<button onClick={()=>onRemove(u.id)} className="text-xs text-red-400 hover:text-red-600 px-2 py-1 border border-red-100 rounded-lg hover:border-red-300">Remove</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Niches & Industries tab */}
      {settingsTab==="niches"&&(
        <NicheIndustryManager niches={niches} industries={industries} onSaveNiches={onSaveNiches} onSaveIndustries={onSaveIndustries} settings={settings}/>
      )}
    </div>
  );
}

// ══ DISCOVER ══
function Discover({leads,onSave,onBatchSave,onEnrich,onOutreach,cu,niches:dynNiches,industries:dynIndustries}){
  const nicheList=dynNiches||NICHES;
  const industryList=dynIndustries||INDUSTRIES;
  const [mode,setMode]=useState("industry");
  const [industry,setIndustry]=useState("");
  const [niche,setNiche]=useState("");
  const [subNiche,setSubNiche]=useState("");
  const [size,setSize]=useState("");const [loc,setLoc]=useState("");const [sigs,setSigs]=useState([]);const [loading,setLoading]=useState(false);const [results,setResults]=useState([]);const [err,setErr]=useState("");
  const myCount=leads.filter(l=>l.ownerId===cu.username).length;
  const selectedNiche=nicheList.find(n=>n.id===niche);
  function togSig(s){setSigs(p=>p.includes(s)?p.filter(x=>x!==s):[...p,s]);}
  function isSaved(n){return leads.some(l=>l.name===n);}
  function switchMode(m){setMode(m);setIndustry("");setNiche("");setSubNiche("");setResults([]);setErr("");}

  const searchLabel = mode==="industry"
    ? industry
    : selectedNiche ? `${selectedNiche.label}${subNiche?` — ${subNiche}`:""}` : "";

  const canSearch = mode==="industry" ? !!industry : !!niche;

  async function search(){
    if(!canSearch)return;setLoading(true);setResults([]);setErr("");
    const sig=sigs.length?sigs.join(", "):"actively hiring or growing";
    const target=mode==="industry"?`Industry: ${industry}`:`Niche: ${selectedNiche.label}${subNiche?`, sub-niche: ${subNiche}`:""}`;
    const now=new Date();
    const sixMonthsAgo=new Date(now);sixMonthsAgo.setMonth(now.getMonth()-6);
    const sinceDate=sixMonthsAgo.toLocaleDateString("en-US",{month:"long",year:"numeric"});
    const currentDate=now.toLocaleDateString("en-US",{month:"long",year:"numeric"});
    // Existing leads to exclude
    const existingNames=leads.map(l=>l.name).filter(Boolean);
    const excludeClause=existingNames.length>0?`\nEXCLUDE these companies (already in our leads): ${existingNames.join(", ")}`:""
    const prompt=`You are a B2B sales researcher for Evolve ESolutions (IT/HR/Healthcare/Legal/Financial Services recruitment, Pleasanton CA).

Find exactly 3 real companies matching:
- ${target}
- Size: ${size||"any"} | Location: ${loc||"any"} | Signal: ${sig}
- Buying signal must be from ${sinceDate} to ${currentDate} (last 6 months only)${excludeClause}

Rules:
- Return EXACTLY 3 companies (fewer if not enough match)
- Each must have a verifiable recent signal with month + year
- CRITICAL: Only include companies where you know the real website URL with certainty (e.g. "taktile.com", "lattice.com"). If you are not sure of the real domain, omit that company entirely — do NOT guess or construct a domain from the company name.
- The website field must be a clean domain like "company.com" — no https://, no www., no paths.
- Do not return companies already listed in EXCLUDE above
- Output ONLY a raw JSON array, no markdown fences, no explanation

[{"name":"Company Name","industry":"","size":"","location":"","website":"company.com","signal":"what happened + Month YYYY","fitScore":82,"fitReason":"why Evolve should call them now"}]`;

    try{
      const t=await ai(prompt,false,800); // no web search — avoids rate limit, Claude knows companies well
      // Robust JSON extraction — try multiple strategies
      let parsed=null;
      const strategies=[
        ()=>JSON.parse(t.trim()),
        ()=>JSON.parse(t.replace(/```json\n?/g,"").replace(/```\n?/g,"").trim()),
        ()=>{const m=t.match(/\[[\s\S]*?\]/);return m?JSON.parse(m[0]):null;},
        ()=>{const m=t.match(/\[\s*\{[\s\S]*?\}\s*\]/);return m?JSON.parse(m[0]):null;},
      ];
      for(const fn of strategies){try{const r=fn();if(Array.isArray(r)&&r.length){parsed=r;break;}}catch{}}
      if(parsed?.length){
        // Filter: must have a real website, and not already a lead
        const isValidWebsite=w=>w&&w.length>3&&w.includes(".")&&!w.includes(" ");
        const fresh=parsed.filter(r=>
          isValidWebsite(r.website) &&
          !leads.some(l=>l.name===r.name)
        );
        if(parsed.length>0&&fresh.length===0){
          setErr("All results either already exist in your leads or have unverifiable websites. Try a different search.");
          setLoading(false);return;
        }
        const enriched=fresh.map(r=>({...r,website:r.website.replace(/https?:\/\//,"").replace(/^www\./,"").replace(/\/.*/,"").toLowerCase().trim(),searchMode:mode,searchLabel}));
        if(enriched.length){
          setResults(enriched);
          onBatchSave(enriched);
        } else {
          setErr("All results already exist in your leads. Try a different search.");
        }
      } else setErr("Could not parse results. Try again.");
    }catch(e){setErr(`Search failed: ${e.message||"Check API key in Settings."}`);}
    setLoading(false);
  }

  return(
    <div className="max-w-4xl mx-auto px-6 py-8">
      <H1 title="Find your next clients" sub="AI searches the web and surfaces the best matches. Use Industry for broad searches or your 18 Niches for targeted prospecting."/>
      {myCount>0&&<div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2.5 mb-5"><CheckCircle2 size={14} className="text-indigo-500"/><span className="text-xs font-medium text-indigo-700">You have {myCount} saved lead{myCount!==1?"s":""}.</span></div>}

      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        {/* Mode toggle */}
        <div className="flex items-center gap-2 mb-5 p-1 bg-slate-100 rounded-xl w-fit">
          <button onClick={()=>switchMode("industry")} className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${mode==="industry"?"bg-white text-slate-800 shadow-sm":"text-slate-500 hover:text-slate-700"}`}>
            Industry search
          </button>
          <button onClick={()=>switchMode("niche")} className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${mode==="niche"?"bg-white text-slate-800 shadow-sm":"text-slate-500 hover:text-slate-700"}`}>
            Niche search <span className={`ml-1 px-1.5 py-0.5 rounded text-xs font-bold ${mode==="niche"?"bg-indigo-100 text-indigo-700":"bg-slate-200 text-slate-500"}`}>18</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {mode==="industry"?(
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide mb-1.5">Industry *</label>
              <select value={industry} onChange={e=>setIndustry(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:border-slate-400">
                <option value="">Select industry</option>
                {industryList.map(i=><option key={i}>{i}</option>)}
              </select>
            </div>
          ):(
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide mb-1.5">Niche *</label>
              <select value={niche} onChange={e=>{setNiche(e.target.value);setSubNiche("");}} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:border-slate-400">
                <option value="">Select niche</option>
                {nicheList.map(n=><option key={n.id} value={n.id}>{n.id}. {n.label}</option>)}
              </select>
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide mb-1.5">Company size</label>
            <select value={size} onChange={e=>setSize(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:border-slate-400">
              <option value="">Any size</option>
              {SIZES.map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Sub-niche selector — only in niche mode when a niche is selected */}
        {mode==="niche"&&selectedNiche&&(
          <div className="mb-4">
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide mb-1.5">Sub-niche <span className="text-slate-300 normal-case font-normal">(optional — narrows search further)</span></label>
            <div className="flex flex-wrap gap-2">
              {selectedNiche.subs.map(s=>(
                <button key={s} onClick={()=>setSubNiche(p=>p===s?"":s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${subNiche===s?"bg-slate-800 text-white border-slate-800":"bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-700"}`}>{s}</button>
              ))}
            </div>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide mb-1.5">Location</label>
          <input type="text" value={loc} onChange={e=>setLoc(e.target.value)} placeholder="e.g. San Francisco, CA" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-slate-400"/>
        </div>
        <div className="mb-5">
          <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">Buying signals</label>
          <div className="flex flex-wrap gap-2">{SIGNALS.map(s=><Chip key={s} label={s} selected={sigs.includes(s)} onClick={()=>togSig(s)}/>)}</div>
        </div>

        <button onClick={search} disabled={!canSearch||loading} className={`w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all ${canSearch&&!loading?"bg-slate-800 text-white hover:bg-slate-700":"bg-slate-100 text-slate-400 cursor-not-allowed"}`}>
          {loading?<><Loader2 size={15} className="animate-spin"/>Searching the web...</>:<><Search size={15}/>Find matching clients{searchLabel?` in ${searchLabel}`:""}</>}
        </button>
      </div>

      {err&&<div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4"><AlertCircle size={14}/>{err}</div>}

      {results.length>0&&(
        <>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-700">{results.length} companies found</h2>
              {searchLabel&&<p className="text-xs text-slate-400">{mode==="niche"?"Niche":"Industry"}: {searchLabel}</p>}
            </div>
            <span className="text-xs text-slate-400">Live web results</span>
          </div>
          <div className="flex flex-col gap-3">
            {results.map((c,i)=>(
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 hover:border-slate-300 transition-all">
                <div className="flex items-start gap-3">
                  <Av name={c.name} idx={i}/>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="font-semibold text-slate-800 text-sm">{c.name}</span>
                      <Score s={c.fitScore}/>
                      {c.searchMode==="niche"&&<span className="text-xs bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-0.5 rounded-full font-medium">{selectedNiche?.label||"Niche"}</span>}
                    </div>
                    <div className="text-xs text-slate-500 mb-1">{c.industry} · {c.size} · {c.location}</div>
                    {c.website&&<a href={`https://${c.website}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline mb-2"><Globe size={11}/>{c.website}</a>}
                    <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mb-2"><span className="text-xs font-medium text-amber-700">Signal: </span><span className="text-xs text-amber-800">{c.signal}</span></div>
                    <p className="text-xs text-slate-500 mb-3">{c.fitReason}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <button onClick={()=>onEnrich(c,i)} className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 text-white rounded-lg text-xs font-medium hover:bg-violet-700"><TrendingUp size={12}/>Enrich</button>
                      <button onClick={()=>onOutreach(c)} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700"><Mail size={12}/>Outreach</button>
                      <button onClick={()=>onSave(c)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${isSaved(c.name)?"bg-slate-800 text-white border-slate-800":"border-slate-200 text-slate-600 hover:border-slate-400"}`}>
                        {isSaved(c.name)?<><BookmarkCheck size={12}/>Saved</>:<><Bookmark size={12}/>Save</>}
                      </button>
                      {c.website&&<span className="text-xs text-slate-400 ml-auto">{c.website}</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ══ SAVED LEADS ══
function Saved({leads,onSave,onEnrich,onOutreach,cu}){
  const isAdmin=cu.role==="admin";
  const visible=isAdmin?leads:leads.filter(l=>l.ownerId===cu.username);
  const [ownerFilter,setOwnerFilter]=useState("all");
  const filtered=ownerFilter==="all"?visible:visible.filter(l=>l.ownerId===ownerFilter);
  const owners=[...new Set(leads.map(l=>l.ownerId))];
  return(
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-xl font-semibold text-slate-800">{isAdmin?"All leads":"My leads"}</h1><p className="text-sm text-slate-500">{visible.length} {isAdmin?"across all account managers":"saved by you"}</p></div>
        {isAdmin&&owners.length>1&&<select value={ownerFilter} onChange={e=>setOwnerFilter(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none"><option value="all">All users</option>{owners.map(o=><option key={o} value={o}>{o}</option>)}</select>}
      </div>
      {filtered.length===0?<div className="bg-white rounded-2xl border border-slate-200 p-12 text-center"><Bookmark size={32} className="text-slate-300 mx-auto mb-3"/><div className="text-slate-500 text-sm">No leads here yet.</div></div>:(
        <div className="flex flex-col gap-3">
          {filtered.map((c,i)=>(
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <Av name={c.name} idx={i}/>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap"><span className="font-semibold text-slate-800 text-sm">{c.name}</span><Score s={c.fitScore}/>{isAdmin&&c.ownerName&&<span className="flex items-center gap-1 text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full"><User size={10}/>{c.ownerName}</span>}</div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-slate-500">{c.industry} · {c.location}</span>
                    {c.website&&<a href={`https://${c.website}`} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"><Globe size={10}/>{c.website}</a>}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5 truncate">{c.signal}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={()=>onEnrich(c,i)} className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 text-white rounded-lg text-xs font-medium hover:bg-violet-700"><TrendingUp size={12}/>Enrich</button>
                  <button onClick={()=>onOutreach(c)} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700"><Mail size={12}/>Outreach</button>
                  <button onClick={()=>onSave(c)} className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-slate-500 rounded-lg text-xs hover:border-red-200 hover:text-red-500"><Trash2 size={12}/>Remove</button>
                </div>
              </div>
              {isAdmin&&<LogPanel log={c.activityLog||[]}/>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ══ ENRICH ══
function Enrich({company,idx,onBack,onOutreach,onSave,isSaved,cu,settings}){
  const [loading,setLoading]=useState(false);const [data,setData]=useState(null);const [err,setErr]=useState("");const [cached,setCached]=useState(false);
  const apolloKey=settings?.apolloKey||"";
  const sbUrl=settings?.supabaseUrl;const sbKey=settings?.supabaseKey;
  const slug=company.name.toLowerCase().replace(/\s+/g,"_");
  useEffect(()=>{
    async function loadCached(){
      const local=await sg(`enr_${slug}`);
      if(local){setData(local);setCached(true);return;}
      if(sbUrl&&sbKey){
        const sbData=await sbLoadEnrichment(sbUrl,sbKey,slug);
        if(sbData){setData(sbData);setCached(true);ss(`enr_${slug}`,sbData);}
      }
    }
    loadCached();
  },[company.name]);
  async function enrich(){
    setLoading(true);setErr("");setData(null);setCached(false);
    const prompt=`Business intelligence for Evolve ESolutions. Research ${company.name} (${company.website||company.industry}, ${company.location}).
CRITICAL RULES FOR CONTACTS:
1. Only include email if you have found it from a verifiable source (company website, press release, LinkedIn, etc). DO NOT guess or construct email addresses from name patterns.
2. If email is unknown, set email to null. Never guess formats like firstname@company.com.
3. Same for phone - only include if found from a real source. Set to null if unknown.
4. Email type: "Work" (company domain) or "Personal" (gmail/yahoo etc). Null if no email found.
5. Phone type: "Direct", "Mobile", "Office", or "HQ". Null if no phone found.
Return ONLY valid JSON:
{"description":"2-sentence overview","founded":"year","headcount":"estimate","revenue":"estimate or Private","funding":"round or Bootstrapped","recentNews":["3 items with dates"],"techStack":["3-5 tech"],"hiringRoles":["3-4 areas"],"keyContacts":[{"name":"","title":"","email":null,"emailType":null,"phone":null,"phoneType":null,"linkedin":"","source":"AI","emailVerified":false},{"name":"","title":"","email":null,"emailType":null,"phone":null,"phoneType":null,"linkedin":"","source":"AI","emailVerified":false}],"painPoints":["2-3 points"],"approachAngle":"one specific angle for Evolve ESolutions","enrichmentSource":"AI"}`;
    try{const t=await ai(prompt,false);const clean=t.replace(/```json\n?/g,"").replace(/```\n?/g,"").trim();const m=clean.match(/\{[\s\S]*\}/);if(m){const d=JSON.parse(m[0]);setData(d);await ss(`enr_${slug}`,d);if(sbUrl&&sbKey){sbSaveEnrichment(sbUrl,sbKey,slug,company.name,d);sbSaveContacts(sbUrl,sbKey,company.name,d.keyContacts||[]);}}else setErr("Parse failed. Try again.");}catch(e){setErr(`Enrichment failed: ${e.message}`);}setLoading(false);
  }
  async function enrichWithApollo(){
    if(!apolloKey){setErr("Add Apollo API key in Settings first.");return;}
    if(!data){setErr("Run AI enrichment first — Apollo overlays contacts on top of the AI research.");return;}
    setLoading(true);setErr("");setData(null);setCached(false);
    try{
      // Extract clean domain from website — NO guessing from company name
      const rawSite=company.website?.replace(/https?:\/\//,"").replace(/^www\./,"").replace(/\/.*/,"")?.toLowerCase()?.trim()||"";
      const domain=rawSite;
      if(!domain||domain.length<4||!domain.includes(".")){
        setErr("No verified website found for this company. Add the correct website URL to the lead first, then try Apollo enrichment.");
        setLoading(false);return;
      }
      console.log("Apollo domain search:",domain);
      // Apollo: fetch contacts only, keep existing AI company data
      let peopleRes=null;
      try{ peopleRes=await apolloFindContacts(domain,apolloKey); }
      catch(e){ setErr(`Apollo failed: ${e.message}`);setLoading(false);return; }
      const people=(peopleRes?.people||[]).slice(0,3);
      if(!people.length){
        setErr(`No contacts found on Apollo for domain: ${domain}. Check the domain is correct or try a different company.`);
        setLoading(false);return;
      }
      const apolloContacts=people.map(p=>({
        name:`${p.first_name||""} ${p.last_name||""}`.trim()||"Unknown",
        title:p.title||"",
        email:p.email||"Not found",
        emailType:p.email?.includes(domain)?"Work":"Unknown",
        phone:p.phone_numbers?.[0]?.raw_number||"Not found",
        phoneType:p.phone_numbers?.[0]?.type||"Not found",
        linkedin:p.linkedin_url||"",
        source:"Apollo",
      }));
      // Merge: keep all AI company data, overlay Apollo contacts
      const merged={...(data||{}),keyContacts:apolloContacts,enrichmentSource:"Apollo (contacts)"};
      setData(merged);
      await ss(`enr_${slug}`,merged);
      if(sbUrl&&sbKey){
        sbSaveEnrichment(sbUrl,sbKey,slug,company.name,merged);
        sbSaveContacts(sbUrl,sbKey,company.name,apolloContacts);
      }
    }catch(e){setErr(`Apollo contact enrichment failed: ${e.message}`);}
    setLoading(false);
  }
  const CC=({c,i})=>{
    const [cp,setCp]=useState("");
    function copy(v,f){if(!v||v==="Not found")return;navigator.clipboard.writeText(v);setCp(f);setTimeout(()=>setCp(""),2000);}
    return(
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
        <div className="flex items-center gap-3 mb-3"><div className={`w-9 h-9 rounded-xl flex items-center justify-center font-semibold text-sm ${PALETTES[i%PALETTES.length]}`}>{c.name.split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase()}</div><div className="flex-1"><div className="flex items-center gap-2"><span className="text-sm font-semibold text-slate-800">{c.name}</span>{c.source&&<span className={`text-xs px-1.5 py-0.5 rounded font-medium ${c.source==="Apollo"?"bg-blue-50 text-blue-700":"bg-violet-50 text-violet-700"}`}>{c.source}</span>}</div><div className="text-xs text-slate-500">{c.title}</div></div></div>
        <div className="space-y-2">
          <div className="flex items-center gap-2"><Mail size={13} className="text-slate-400 flex-shrink-0"/><span className="text-xs text-slate-700 flex-1 truncate">{c.email||"—"}</span>{c.emailType&&<CtBadge label={c.emailType}/>}{c.email&&c.email!=="Not found"&&<button onClick={()=>copy(c.email,"e"+i)} className="text-xs text-slate-400 hover:text-slate-600 px-2 py-0.5 rounded border border-slate-200 flex-shrink-0">{cp==="e"+i?"✓":"Copy"}</button>}</div>
          <div className="flex items-center gap-2"><Phone size={13} className="text-slate-400 flex-shrink-0"/>{c.phone&&c.phone!=="Not found"?<a href={`tel:${c.phone.replace(/\s/g,"")}`} className="text-xs text-emerald-700 hover:underline flex-1">{c.phone}</a>:<span className="text-xs text-slate-400 italic flex-1">Not found</span>}{c.phoneType&&c.phoneType!=="Not found"&&<CtBadge label={c.phoneType}/>}{c.phone&&c.phone!=="Not found"&&<button onClick={()=>copy(c.phone,"p"+i)} className="text-xs text-slate-400 hover:text-slate-600 px-2 py-0.5 rounded border border-slate-200 flex-shrink-0">{cp==="p"+i?"✓":"Copy"}</button>}</div>
          <div className="flex items-center gap-2"><Linkedin size={13} className="text-slate-400 flex-shrink-0"/>{c.linkedin&&c.linkedin.length>5?<a href={`https://${c.linkedin.replace("https://","")}`} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline flex-1 truncate">{c.linkedin}</a>:<a href={`https://linkedin.com/search/results/people/?keywords=${encodeURIComponent(c.name+" "+company.name)}`} target="_blank" rel="noreferrer" className="text-xs text-slate-400 hover:text-blue-600 flex-1">Search on LinkedIn →</a>}</div>
        </div>
      </div>
    );
  };
  return(
    <div className="max-w-4xl mx-auto px-6 py-8">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-5"><ArrowLeft size={14}/>Back</button>
      <div className="flex items-center gap-3 mb-6"><Av name={company.name} idx={idx} lg/><div className="flex-1"><div className="flex items-center gap-2"><h1 className="text-xl font-semibold text-slate-800">{company.name}</h1><Score s={company.fitScore}/></div><p className="text-sm text-slate-500">{company.industry} · {company.size} · {company.location}</p>
        {company.website?<p className="text-xs text-slate-400 flex items-center gap-1"><Globe size={11}/>{company.website}</p>:<p className="text-xs text-amber-600 flex items-center gap-1">⚠️ No verified website — Apollo enrichment unavailable</p>}
        </div><div className="flex gap-2"><button onClick={()=>onOutreach(company)} className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700"><Mail size={14}/>Outreach</button><button onClick={()=>onSave(company)} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${isSaved?"bg-slate-800 text-white border-slate-800":"border-slate-200 text-slate-700 hover:border-slate-400"}`}>{isSaved?<><BookmarkCheck size={14}/>Saved</>:<><Bookmark size={14}/>Save</>}</button></div></div>
      {!data&&!loading&&<div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
        <TrendingUp size={36} className="text-slate-300 mx-auto mb-3"/>
        <h2 className="font-semibold text-slate-700 mb-1">Deep company research</h2>
        <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">AI researches the company and surfaces contacts, news, tech stack and a tailored approach angle. Then optionally overlay verified contacts from Apollo.</p>
        <button onClick={enrich} className="px-6 py-3 bg-violet-600 text-white rounded-xl text-sm font-medium hover:bg-violet-700 flex items-center gap-2 mx-auto"><Zap size={15}/>Run AI enrichment</button>
      </div>}
      {loading&&<div className="bg-white rounded-2xl border border-slate-200 p-10 text-center"><Loader2 size={28} className="animate-spin text-violet-500 mx-auto mb-3"/><p className="text-sm text-slate-500 mb-1">Researching {company.name}…</p><p className="text-xs text-slate-400">Classifying contacts — 20–30 seconds.</p></div>}
      {err&&<div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4"><AlertCircle size={14}/>{err}</div>}
      {data&&<div className="space-y-4">
        <div className={`flex items-center justify-between px-4 py-2.5 rounded-xl border ${cached?"bg-indigo-50 border-indigo-100":"bg-emerald-50 border-emerald-100"}`}>
        <div className="flex items-center gap-2">
          <CheckCircle2 size={14} className={cached?"text-indigo-500":"text-emerald-500"}/>
          <span className={`text-xs font-medium ${cached?"text-indigo-700":"text-emerald-700"}`}>
            {cached?"Loaded from cache":"Enriched"} · Source: <span className="font-semibold">{data.enrichmentSource||"AI"}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          {apolloKey&&<button onClick={enrichWithApollo} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded-lg border border-blue-200 bg-blue-50"><Users size={11}/>Overlay Apollo contacts</button>}
          <button onClick={enrich} className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 px-2 py-1 rounded-lg border border-slate-200 bg-white"><RefreshCw size={11}/>Re-run AI</button>
        </div>
      </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5"><h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Overview</h3><p className="text-sm text-slate-700 leading-relaxed mb-4">{data.description}</p><div className="grid grid-cols-4 gap-3">{[["Founded",data.founded],["Headcount",data.headcount],["Revenue",data.revenue],["Funding",data.funding]].map(([l,v])=><div key={l} className="bg-slate-50 rounded-xl p-3"><div className="text-xs text-slate-400 mb-1">{l}</div><div className="text-sm font-semibold text-slate-800">{v||"—"}</div></div>)}</div></div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5"><div className="flex items-center justify-between mb-3"><h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1.5"><Users size={13}/>Key contacts — classified</h3><div className="flex gap-1.5">{["Work","Personal","Direct","Mobile"].map(l=><CtBadge key={l} label={l}/>)}</div></div><div className="grid grid-cols-2 gap-3">{(data.keyContacts||[]).map((c,i)=><CC key={i} c={c} i={i}/>)}</div></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5"><h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-1.5"><BarChart2 size={13}/>Recent news</h3><ul className="space-y-2">{(data.recentNews||[]).map((n,i)=><li key={i} className="flex items-start gap-2 text-sm text-slate-700"><span className="w-4 h-4 rounded-full bg-violet-100 text-violet-700 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">{i+1}</span>{n}</li>)}</ul></div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5"><h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-1.5"><Users size={13}/>Hiring areas</h3><div className="flex flex-wrap gap-2 mb-4">{(data.hiringRoles||[]).map((r,i)=><Pill key={i} label={r} color="bg-emerald-50 text-emerald-700"/>)}</div><h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1.5"><Globe size={13}/>Tech stack</h3><div className="flex flex-wrap gap-2">{(data.techStack||[]).map((t,i)=><Pill key={i} label={t} color="bg-slate-100 text-slate-600"/>)}</div></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5"><h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-1.5"><AlertCircle size={13}/>Pain points</h3><ul className="space-y-2">{(data.painPoints||[]).map((p,i)=><li key={i} className="flex items-start gap-2 text-sm text-slate-700"><span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 flex-shrink-0"/>{p}</li>)}</ul></div>
          <div className="bg-violet-50 border border-violet-100 rounded-2xl p-5"><h3 className="text-xs font-semibold text-violet-400 uppercase tracking-wide mb-3 flex items-center gap-1.5"><Target size={13}/>Recommended approach</h3><p className="text-sm text-violet-900 leading-relaxed font-medium">{data.approachAngle}</p></div>
        </div>
      </div>}
    </div>
  );
}

// ══ OUTREACH ══
function Outreach({company,onBack,onSave,isSaved,cu,onLogAct,settings}){
  const [tmpl,setTmpl]=useState(SEQ_TEMPLATES[1]);const [step,setStep]=useState(null);const [eType,setEType]=useState("intro");const [content,setContent]=useState("");const [loading,setLoading]=useState(false);const [cp,setCp]=useState(false);
  const outreachCacheKey=`outreach_${company.name.replace(/\s+/g,"_")}_${tmpl?.id||"default"}`;
  const [generatedSteps,setGeneratedSteps]=useState(()=>{
    // Load cached steps from localStorage on init
    try{const raw=localStorage.getItem(outreachCacheKey);return raw?JSON.parse(raw):{};}catch{return {};}
  });
  const [liC,setLiC]=useState([]);const [liMsg,setLiMsg]=useState({});const [liLoad,setLiLoad]=useState({});const [liCp,setLiCp]=useState("");const [liOpen,setLiOpen]=useState(true);
  const [phC,setPhC]=useState([]);const [scripts,setScripts]=useState({});const [texts,setTexts]=useState({});const [audios,setAudios]=useState({});const [playing,setPlaying]=useState({});const [lScript,setLScript]=useState({});const [lText,setLText]=useState({});const [lVoice,setLVoice]=useState({});const [phTab,setPhTab]=useState({});const [phCp,setPhCp]=useState("");const [phOpen,setPhOpen]=useState(true);
  const [iPushing,setIPushing]=useState(false);const [iPushed,setIPushed]=useState(false);const [iErr,setIErr]=useState("");
  const aRefs=useRef({});
  const instantlyKey=settings?.instantlyV2Key||settings?.instantlyKey||"";
  useEffect(()=>{sg(`enr_${company.name.toLowerCase().replace(/\s+/g,"_")}`).then(d=>{if(d?.keyContacts){setLiC(d.keyContacts.filter(c=>c.linkedin&&c.linkedin.length>5));setPhC(d.keyContacts.filter(c=>c.phone&&c.phone!=="Not found"));}});},[company.name]);
  const E=`Evolve ESolutions — IT, HR, Healthcare, Financial Services, Legal recruitment, Pleasanton CA. 24–48hr screened candidates. Passive talent. No placement no fee. 1–3 day onboarding.`;
  const iMap={"Technology / SaaS":"IT/software","Financial Services":"finance/compliance","Healthcare":"healthcare/clinical","Legal":"legal/paralegal","Manufacturing":"engineering/ops","E-commerce / Retail":"tech/ops","Construction":"project management","Professional Services":"professional/admin","Media & Marketing":"creative/marketing","Logistics & Supply Chain":"ops/tech"};
  const spec=iMap[company.industry]||company.industry;
  // Emails use Instantly merge tags — sender name and signature injected per mailbox
  const placeholderSig="{{sender_name}}\nEvolve ESolutions\n{{signature}}";
  const prompts={
    intro:`Write a cold intro email from Evolve ESolutions to a decision-maker at ${company.name}.\n${E}\nTarget: ${company.name}, ${company.industry}, ${company.size}, ${company.location}. Signal: ${company.signal}. Why: ${company.fitReason}\nHook on signal. One sentence on Evolve+${spec}. 24–48hr+passive talent pitch. Specific day CTA. Under 120 words body. Professional, human tone.\nSubject: [under 8 words, no "Introducing"]\n\n[email body]\n\n${placeholderSig}`,
    followup:`Write a follow-up email from Evolve ESolutions to ${company.name} — no reply received.\n${E}\nSignal: ${company.signal}. Acknowledge they are busy. Lead with different value (no-fee model). Mention recent ${spec} placements. Soft CTA. Under 80 words.\nSubject: [subject]\n\n[email body]\n\n${placeholderSig}`,
    casestudy:`Write a case study email from Evolve ESolutions to ${company.name}.\n${E}\nSignal: ${company.signal}. Include a mini case study: similar company, similar role, 24-48hr timeline, outcome. Connect directly to ${company.name}'s situation. Under 110 words. CTA: happy to share more.\nSubject: [subject]\n\n[email body]\n\n${placeholderSig}`,
    value:`Write a value-add email from Evolve ESolutions to ${company.name} — asking for nothing.\n${E}\nSignal: ${company.signal}. Share a genuine hiring trend insight for ${spec}. Position as a knowledgeable partner. Soft close. Under 100 words.\nSubject: [subject]\n\n[email body]\n\n${placeholderSig}`,
    breakup:`Write a break-up email from Evolve ESolutions to ${company.name}. Acknowledge it's one-sided. Leave the door open. One final value line. Under 70 words. The best break-up emails always get replies.\nSubject: [subject]\n\n[email body]\n\n${placeholderSig}`,
  };
  async function gen(s,t){
    setStep(s);setEType(t||"intro");setContent("");setLoading(true);
    try{
      const txt=await ai(prompts[t||"intro"]||prompts.intro,false,600); // 600 tokens is plenty for short emails
      setContent(txt);
      // Parse subject and body
      const lines=txt.split("\n");
      const subLine=lines.find(l=>l.toLowerCase().startsWith("subject:"))||"Subject: Quick follow-up";
      const subj=subLine.replace(/^subject:\s*/i,"").trim();
      const bodyLines=lines.slice(lines.indexOf(subLine)+2);
      const body=bodyLines.join("\n").trim();
      // Store in generatedSteps map so Push to Instantly can use without re-generating
      setGeneratedSteps(prev=>{
        const next={...prev,[s.label]:{subject:subj,body,day:s.day,label:s.label}};
        try{localStorage.setItem(outreachCacheKey,JSON.stringify(next));}catch{}
        return next;
      });
      onLogAct(company,"outreach generated");
      // Save to DB
      if(settings?.supabaseUrl&&settings?.supabaseKey){
        sbSaveOutreach(settings.supabaseUrl,settings.supabaseKey,company.name,cu.username,tmpl.id,[{day:s.day,label:s.label,subject:subj,body}]);
      }
    }catch(e){setContent(`Error: ${e.message||"Check API key in Settings."}`);}
    setLoading(false);
  }

  async function pushToInstantly(){
    if(!instantlyKey){setIErr("Add Instantly API key in Settings first.");return;}
    // Use already-generated steps — no re-generation needed (avoids rate limit)
    const emailSteps=tmpl.steps.filter(s=>s.type==="email");
    const missing=emailSteps.filter(s=>!generatedSteps[s.label]);
    if(missing.length>0){
      setIErr(`Please generate all email steps first. Missing: ${missing.map(s=>s.label).join(", ")}`);
      return;
    }
    setIPushing(true);setIErr("");setIPushed(false);
    try{
      // Use pre-generated steps from state
      const steps=emailSteps.map(s=>generatedSteps[s.label]).filter(Boolean);
      const enriched=await sg(`enr_${company.name.toLowerCase().replace(/\s+/g,"_")}`);
      const contacts=(enriched?.keyContacts||[]).filter(c=>c.email&&c.email!=="Not found"&&c.email!==null).map(c=>({...c,company:company.name}));
      const campaignName=`Evolve — ${company.name} — ${new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})}`;
      const campaignId=await instantlyCreateCampaign(instantlyKey,campaignName,contacts,steps);
      onLogAct(company,"pushed to Instantly");
      setIPushed(campaignId);
      // Save full sequence to DB
      if(settings?.supabaseUrl&&settings?.supabaseKey){
        sbSaveOutreach(settings.supabaseUrl,settings.supabaseKey,company.name,cu.username,tmpl.id,steps,campaignId);
      }
    }catch(e){setIErr(`Instantly push failed: ${e.message}`);}
    setIPushing(false);
  }
  async function genLi(c,i){setLiLoad(p=>({...p,[i]:true}));const t=await ai(`LinkedIn connection note from Evolve ESolutions to ${c.name}, ${c.title} at ${company.name}. Context: ${company.signal}. Max 300 chars. Warm, peer-to-peer, specific hook, no clichés. Return ONLY note text.`).catch(()=>"Error.");setLiMsg(p=>({...p,[i]:t.trim()}));setLiLoad(p=>({...p,[i]:false}));}
  async function genScript(c,i){setLScript(p=>({...p,[i]:true}));const t=await ai(`Cold call script for ${c.name}, ${c.title} at ${company.name}. Evolve ESolutions — IT/HR/Healthcare recruitment, 24–48hr, passive talent, no-fee. Signal: ${company.signal}. Natural, confident. [OPENING][IF ENGAGE][OBJECTION: PSL][CLOSE]. 200-280 words.`).catch(()=>"Error.");setScripts(p=>({...p,[i]:t}));setPhTab(p=>({...p,[i]:"script"}));setLScript(p=>({...p,[i]:false}));}
  async function genText(c,i){setLText(p=>({...p,[i]:true}));const t=await ai(`SMS follow-up from Evolve ESolutions to ${c.name} at ${company.name} after missed call. Context: ${company.signal}. Max 160 chars. Human not marketing. Identify yourself. One value hook. Light CTA. Return ONLY SMS text.`).catch(()=>"Error.");setTexts(p=>({...p,[i]:t.trim()}));setPhTab(p=>({...p,[i]:"text"}));setLText(p=>({...p,[i]:false}));}
  async function genVoice(i){const s=await sg(S_SETTINGS);const key=s?.elevenLabsKey;if(!key){alert("Add ElevenLabs API key in Settings.");return;}setLVoice(p=>({...p,[i]:true}));try{const blob=await tts(scripts[i].replace(/\[.*?\]/g,""),key,s.elevenLabsVoiceId);const url=URL.createObjectURL(blob);setAudios(p=>({...p,[i]:url}));setPhTab(p=>({...p,[i]:"voice"}));}catch(e){alert(`Voice error: ${e.message}`);}setLVoice(p=>({...p,[i]:false}));}
  function togPlay(i){const a=aRefs.current[i];if(!a)return;if(playing[i]){a.pause();setPlaying(p=>({...p,[i]:false}));}else{a.play();setPlaying(p=>({...p,[i]:true}));a.onended=()=>setPlaying(p=>({...p,[i]:false}));}}
  function copy(v,k){navigator.clipboard.writeText(v);setPhCp(k);setTimeout(()=>setPhCp(""),2000);}

  return(
    <div className="max-w-4xl mx-auto px-6 py-8">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-5"><ArrowLeft size={14}/>Back</button>
      <div className="flex items-start gap-3 mb-5"><Av name={company.name} idx={0} lg/><div className="flex-1"><h1 className="text-xl font-semibold text-slate-800">{company.name}</h1>
          <p className="text-sm text-slate-500">{company.industry} · {company.location}</p>
          {company.website&&<a href={`https://${company.website}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"><Globe size={11}/>{company.website}</a>}
          </div><button onClick={()=>onSave(company)} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${isSaved?"bg-slate-800 text-white border-slate-800":"border-slate-200 text-slate-700 hover:border-slate-400"}`}>{isSaved?<><BookmarkCheck size={14}/>Saved</>:<><Bookmark size={14}/>Save</>}</button></div>

      <InstantlyTags user={cu}/>

      {/* Instantly campaign push */}
      <div className={`rounded-xl border px-4 py-3 mb-5 flex items-center justify-between gap-4 ${iPushed?"bg-emerald-50 border-emerald-100":"bg-slate-50 border-slate-200"}`}>
        <div className="flex-1 min-w-0">
          {iPushed?(
            <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0"/><div><p className="text-xs font-semibold text-emerald-700">Campaign draft created in Instantly</p><p className="text-xs text-emerald-600">ID: {iPushed} — go to Instantly and activate it to start sending.</p></div></div>
          ):(
            <div>
              <p className="text-xs font-semibold text-slate-700">Push full sequence to Instantly</p>
              <p className="text-xs text-slate-500">{(()=>{const total=tmpl.steps.filter(s=>s.type==="email").length;const ready=Object.keys(generatedSteps).length;return ready>=total?`✓ All ${total} steps ready to push`:`${ready}/${total} steps generated — click each step to generate before pushing`;})()}</p>
            </div>
          )}
          {iErr&&<div className="mt-1">
            <p className="text-xs text-red-600">{iErr}</p>
            {iErr.includes("Unauthorized")&&<p className="text-xs text-amber-700 mt-1 bg-amber-50 border border-amber-100 rounded-lg px-2 py-1">
              ⚠️ Your key is a v1 key. Go to Instantly → Settings → API Keys → Create new API Key (v2) with scopes: campaigns:all + leads:all → paste new key in Settings.
            </p>}
          </div>}
        </div>
        {instantlyKey?(
          <button onClick={pushToInstantly} disabled={iPushing} className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-medium hover:bg-slate-700 disabled:opacity-60 flex-shrink-0 whitespace-nowrap">
            {iPushing?<><Loader2 size={12} className="animate-spin"/>Generating & pushing…</>:iPushed?<><RefreshCw size={12}/>Push again</>:<><Mail size={12}/>Push to Instantly</>}
          </button>
        ):(
          <span className="text-xs text-slate-400 flex-shrink-0">Add Instantly key in Settings</span>
        )}
      </div>

      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-2 space-y-4">
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4"><div className="text-xs font-semibold text-indigo-400 uppercase tracking-wide mb-3 flex items-center gap-1.5"><Sparkles size={12}/>Pitch pillars</div><ul className="space-y-2">{[["⚡","24–48hr delivery"],["🎯","Passive talent access"],["🔄","Contract, perm & retained"],["✅","No placement, no fee"],["🚀","1–3 day onboarding"]].map(([icon,text])=><li key={text} className="flex items-center gap-2 text-xs text-indigo-800"><span>{icon}</span><span>{text}</span></li>)}</ul></div>
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Email sequence</h3>
            <div className="flex gap-1.5 mb-3">{SEQ_TEMPLATES.map(t=><button key={t.id} onClick={()=>{setTmpl(t);setGeneratedSteps({});setStep(null);setContent("");}} className={`flex-1 py-2 rounded-xl border text-xs font-medium transition-all ${tmpl.id===t.id?"bg-slate-800 text-white border-slate-800":"border-slate-200 text-slate-600 hover:border-slate-400"}`}>{t.label}</button>)}</div>
            <div className="relative"><div className="absolute left-3.5 top-3 bottom-3 w-px bg-slate-100"/>
              <div className="space-y-2">{tmpl.steps.map((s,i)=><div key={i} className={`relative flex items-center gap-3 p-2.5 rounded-xl cursor-pointer border transition-all ${step?.label===s.label&&step?.day===s.day?"border-emerald-200 bg-emerald-50":"border-transparent hover:border-slate-200 hover:bg-slate-50"}`} onClick={()=>{
                  const eTypeForStep=EMAIL_TYPES.find(e=>s.label.toLowerCase().includes(e[0]))?.[0]||"intro";
                  if(generatedSteps[s.label]){
                    // Already generated — show cached, no API call
                    setStep(s);setEType(eTypeForStep);
                    const gs=generatedSteps[s.label];
                    setContent(`Subject: ${gs.subject}\n\n${gs.body}`);
                  } else {
                    gen(s,eTypeForStep);
                  }
                }}><div className="w-7 h-7 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center z-10 flex-shrink-0"><span className="text-xs font-semibold text-slate-500">{i+1}</span></div><div className="flex-1 min-w-0"><div className="text-xs font-medium text-slate-800">{s.label}</div><div className="text-xs text-slate-400">Day {s.day}</div></div><span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-md font-medium ${s.type==="call"?"bg-amber-100 text-amber-700":"bg-slate-100 text-slate-600"}`}>{s.type==="call"?<Phone size={12}/>:<Mail size={12}/>}{s.type}</span>
                  {generatedSteps[s.label]&&<span className="text-xs text-emerald-600 font-semibold">✓</span>}</div>)}</div>
            </div>
          </div>
        </div>
        <div className="col-span-3">
          {!step&&<div className="bg-white rounded-2xl border border-slate-200 p-10 text-center h-full flex flex-col items-center justify-center"><Mail size={32} className="text-slate-300 mb-3"/><h3 className="font-semibold text-slate-700 mb-1">Select a step</h3><p className="text-sm text-slate-500">Click any step to generate the AI email.</p></div>}
          {step&&<div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50"><div><span className="text-xs font-semibold text-slate-700">{step.label}</span><span className="text-xs text-slate-400 ml-2">· Day {step.day}</span></div><div className="flex gap-2"><button onClick={()=>gen(step,eType)} disabled={loading} className="flex items-center gap-1 text-xs text-slate-500 px-2 py-1 rounded-lg border border-slate-200"><RefreshCw size={11} className={loading?"animate-spin":""}/>Regen</button><button onClick={()=>{navigator.clipboard.writeText(content);setCp(true);setTimeout(()=>setCp(false),2000);}} disabled={!content||loading} className="flex items-center gap-1 text-xs text-slate-600 px-3 py-1 rounded-lg border border-slate-200"><Copy size={11}/>{cp?"Copied!":"Copy"}</button></div></div>
            <div className="p-6 min-h-64">{loading?<div className="flex items-center gap-2 text-slate-400 text-sm"><Loader2 size={15} className="animate-spin"/>Writing {step.label}…</div>:<pre className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed" style={{fontFamily:"inherit"}}>{content}</pre>}</div>
            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex gap-2 flex-wrap items-center"><span className="text-xs text-slate-400 mr-1">Switch:</span>{EMAIL_TYPES.map(([t,l])=><button key={t} onClick={()=>{setEType(t);gen(step,t);}} className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${eType===t?"bg-slate-800 text-white border-slate-800":"border-slate-200 text-slate-500 hover:border-slate-400"}`}>{l}</button>)}</div>
          </div>}
        </div>
      </div>

      {/* Phone */}
      {phC.length>0&&<div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mt-6">
        <button onClick={()=>setPhOpen(p=>!p)} className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50"><div className="flex items-center gap-2"><Phone size={15} className="text-emerald-600"/><span className="text-sm font-semibold text-slate-800">Phone outreach</span><span className="text-xs text-slate-400 ml-1">· {phC.length} contact{phC.length!==1?"s":""} with numbers</span></div><svg className={`text-slate-400 transition-transform ${phOpen?"rotate-180":""}`} width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 5l5 5 5-5"/></svg></button>
        {phOpen&&<div className="px-5 pb-5 border-t border-slate-100"><p className="text-xs text-slate-500 mt-4 mb-4">Call script, ElevenLabs voice note, and SMS follow-up.</p>
          <div className="space-y-5">{phC.map((c,i)=><div key={i} className="border border-slate-100 rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border-b border-slate-100"><div className={`w-9 h-9 rounded-xl flex items-center justify-center font-semibold text-sm flex-shrink-0 ${PALETTES[i%PALETTES.length]}`}>{c.name.split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase()}</div><div className="flex-1"><div className="text-sm font-semibold text-slate-800">{c.name}</div><div className="flex items-center gap-1.5"><span className="text-xs text-slate-500">{c.title}</span>{c.phoneType&&c.phoneType!=="Not found"&&<CtBadge label={c.phoneType}/>}</div></div><a href={`tel:${c.phone.replace(/\s/g,"")}`} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700"><Phone size={12}/>{c.phone}</a></div>
            <div className="p-4">
              <div className="flex gap-2 mb-4 flex-wrap">
                <button onClick={()=>genScript(c,i)} disabled={lScript[i]} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${phTab[i]==="script"?"bg-slate-800 text-white border-slate-800":"border-slate-200 text-slate-600 hover:border-slate-400"}`}>{lScript[i]?<Loader2 size={12} className="animate-spin"/>:<FileText size={12}/>}{lScript[i]?"Writing…":"Call script"}</button>
                <button onClick={()=>genText(c,i)} disabled={lText[i]} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${phTab[i]==="text"?"bg-slate-800 text-white border-slate-800":"border-slate-200 text-slate-600 hover:border-slate-400"}`}>{lText[i]?<Loader2 size={12} className="animate-spin"/>:<Mail size={12}/>}{lText[i]?"Writing…":"SMS"}</button>
                {scripts[i]&&<button onClick={()=>genVoice(i)} disabled={lVoice[i]} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${phTab[i]==="voice"?"bg-indigo-600 text-white border-indigo-600":"border-slate-200 text-slate-600 hover:border-slate-400"}`}>{lVoice[i]?<Loader2 size={12} className="animate-spin"/>:<Mic size={12}/>}{lVoice[i]?"Generating…":"Voice note"}</button>}
                {(scripts[i]||texts[i])&&<button onClick={()=>copy(phTab[i]==="text"?texts[i]:scripts[i],`ph${i}`)} className="ml-auto flex items-center gap-1 text-xs text-slate-500 px-3 py-2 rounded-lg border border-slate-200"><Copy size={11}/>{phCp===`ph${i}`?"Copied!":"Copy"}</button>}
              </div>
              {phTab[i]==="script"&&scripts[i]&&<pre className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed bg-slate-50 rounded-xl p-4 border border-slate-100" style={{fontFamily:"inherit"}}>{scripts[i]}</pre>}
              {phTab[i]==="text"&&texts[i]&&<div><div className="flex justify-between mb-2"><span className="text-xs font-semibold text-slate-500 uppercase">SMS</span><span className={`text-xs font-medium ${texts[i].length>160?"text-red-500":texts[i].length>130?"text-amber-500":"text-slate-400"}`}>{texts[i].length}/160</span></div><div className="bg-slate-800 rounded-2xl rounded-bl-sm px-4 py-3 max-w-xs"><p className="text-sm text-white">{texts[i]}</p></div></div>}
              {phTab[i]==="voice"&&audios[i]&&<div><div className="flex items-center gap-2 mb-3"><span className="text-xs font-semibold text-slate-500 uppercase">Voice note</span><Pill label="ElevenLabs" color="bg-indigo-50 text-indigo-700"/></div><div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-center gap-4"><button onClick={()=>togPlay(i)} className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${playing[i]?"bg-indigo-600":"bg-white border border-indigo-200"}`}>{playing[i]?<Square size={14} className="text-white"/>:<Play size={14} className="text-indigo-600 ml-0.5"/>}</button><div className="flex-1"><div className="h-1.5 bg-indigo-100 rounded-full"><div className="h-full w-1/3 bg-indigo-400 rounded-full"/></div><div className="text-xs text-indigo-500 mt-1">ElevenLabs · Professional voice</div></div><a href={audios[i]} download={`evolve-${company.name.replace(/\s/g,"-")}.mp3`} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700"><Download size={12}/>MP3</a></div><audio ref={el=>aRefs.current[i]=el} src={audios[i]} style={{display:"none"}}/></div>}
              {!scripts[i]&&!texts[i]&&!lScript[i]&&!lText[i]&&<div className="text-center py-6 text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl">Generate a call script, SMS, or voice note above</div>}
            </div>
          </div>)}</div>
          <div className="mt-4 flex items-start gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3"><AlertCircle size={13} className="text-emerald-500 mt-0.5 flex-shrink-0"/><p className="text-xs text-emerald-800">Best times: <span className="font-semibold">Tue–Thu 10–11am or 2–4pm</span> local. Send SMS within 5 min of missed call.</p></div>
        </div>}
      </div>}

      {/* LinkedIn */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mt-4">
        <button onClick={()=>setLiOpen(p=>!p)} className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50"><div className="flex items-center gap-2"><Linkedin size={15} className="text-blue-600"/><span className="text-sm font-semibold text-slate-800">LinkedIn outreach</span><span className="text-xs text-slate-400 ml-1">· separate from email sequence</span></div><svg className={`text-slate-400 transition-transform ${liOpen?"rotate-180":""}`} width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 5l5 5 5-5"/></svg></button>
        {liOpen&&<div className="px-5 pb-5 border-t border-slate-100"><p className="text-xs text-slate-500 mt-4 mb-4">Connect before Day 1 — a recognised name lifts open rates significantly.</p>
          {liC.length===0&&<div className="text-sm text-slate-400 py-2">Run enrichment first to populate LinkedIn contacts.</div>}
          <div className="space-y-4">{liC.map((c,i)=><div key={i} className="border border-slate-100 rounded-xl p-4 bg-slate-50">
            <div className="flex items-center gap-3 mb-3"><div className={`w-9 h-9 rounded-xl flex items-center justify-center font-semibold text-sm flex-shrink-0 ${PALETTES[i%PALETTES.length]}`}>{c.name.split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase()}</div><div className="flex-1"><div className="text-sm font-semibold text-slate-800">{c.name}</div><div className="text-xs text-slate-500">{c.title}</div></div><a href={`https://${c.linkedin.replace("https://","")}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700"><Linkedin size={12}/>View profile</a></div>
            {!liMsg[i]&&!liLoad[i]&&<button onClick={()=>genLi(c,i)} className="w-full py-2.5 border border-dashed border-slate-300 rounded-xl text-xs text-slate-500 hover:border-blue-300 hover:text-blue-600 flex items-center justify-center gap-1.5"><Sparkles size={12}/>Generate connection note</button>}
            {liLoad[i]&&<div className="flex items-center gap-2 text-slate-400 text-xs py-2"><Loader2 size={12} className="animate-spin"/>Writing…</div>}
            {liMsg[i]&&!liLoad[i]&&<div><div className="bg-white border border-slate-200 rounded-xl p-3 text-sm text-slate-700 leading-relaxed mb-2">{liMsg[i]}</div><div className="flex items-center justify-between"><span className={`text-xs font-medium ${liMsg[i].length>300?"text-red-500":liMsg[i].length>260?"text-amber-500":"text-slate-400"}`}>{liMsg[i].length}/300</span><div className="flex gap-2"><button onClick={()=>genLi(c,i)} className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 px-2 py-1 rounded-lg border border-slate-200"><RefreshCw size={10}/>Regen</button><button onClick={()=>{navigator.clipboard.writeText(liMsg[i]);setLiCp(`li${i}`);setTimeout(()=>setLiCp(""),2000);}} className="flex items-center gap-1 text-xs text-slate-600 px-3 py-1 rounded-lg border border-slate-200"><Copy size={10}/>{liCp===`li${i}`?"Copied!":"Copy"}</button></div></div></div>}
          </div>)}</div>
        </div>}
      </div>
    </div>
  );
}

// ══ ROOT APP ══
export default function App(){
  const [cu,setCu]=useState(null);const [ready,setReady]=useState(false);const [view,setView]=useState("discover");const [settings,setSettings]=useState({});const [users,setUsers]=useState([DEFAULT_ADMIN]);const [leads,setLeads]=useState([]);
  const [dynNiches,setDynNiches]=useState(NICHES);
  const [dynIndustries,setDynIndustries]=useState(INDUSTRIES);
  const [eTarget,setETarget]=useState(null);const [eIdx,setEIdx]=useState(0);const [oTarget,setOTarget]=useState(null);

  useEffect(()=>{
    Promise.all([sg(S_SESSION),sg(S_SETTINGS),sg(S_USERS),sg(S_LEADS)]).then(async([ses,s,u,l])=>{
      if(ses)setCu(ses);
      const loadedSettings=s||{};
      setSettings(loadedSettings);
      if(loadedSettings.anthropicKey) _anthropicKey=loadedSettings.anthropicKey;
      // Load from Supabase if connected, fallback to localStorage
      if(loadedSettings.supabaseUrl&&loadedSettings.supabaseKey){
        const [sbLeadRows,config]=await Promise.all([
          sbGetAll(loadedSettings.supabaseUrl,loadedSettings.supabaseKey,"leads"),
          loadConfigFromSB(loadedSettings.supabaseUrl,loadedSettings.supabaseKey),
        ]);
        // Leads: stored in data column
        if(sbLeadRows.length) setLeads(sbLeadRows.map(r=>r.data||r));
        else setLeads(l||[]);
        // Users: stored in config table
        if(config?.users?.length) setUsers(config.users);
        else setUsers(u||[DEFAULT_ADMIN]);
        if(config?.niches?.length)setDynNiches(config.niches);
        if(config?.industries?.length)setDynIndustries(config.industries);
      } else {
        setLeads(l||[]);
        setUsers(u||[DEFAULT_ADMIN]);
      }
      setReady(true);
    });
  },[]);

  async function login(user){setCu(user);await ss(S_SESSION,{...user,password:undefined});setView("discover");}
  async function logout(){setCu(null);await ss(S_SESSION,null);}
  async function saveSettings(s){
    setSettings(s);
    await ss(S_SETTINGS,s);
    if(s.anthropicKey) _anthropicKey=s.anthropicKey;
  }
  async function saveNiches(niches){
    setDynNiches(niches);
    await ss("evolve_niches_v4",niches);
    if(settings.supabaseUrl&&settings.supabaseKey) await saveConfigToSB(settings.supabaseUrl,settings.supabaseKey,"niches",niches);
  }
  async function saveIndustries(industries){
    setDynIndustries(industries);
    await ss("evolve_industries_v4",industries);
    if(settings.supabaseUrl&&settings.supabaseKey) await saveConfigToSB(settings.supabaseUrl,settings.supabaseKey,"industries",industries);
  }
  async function addUser(u){
    const n=[...users,u];setUsers(n);await ss(S_USERS,n);
    if(settings.supabaseUrl&&settings.supabaseKey) saveConfigToSB(settings.supabaseUrl,settings.supabaseKey,"users",n);
  }
  async function removeUser(id){
    const n=users.filter(u=>u.id!==id);setUsers(n);await ss(S_USERS,n);
    if(settings.supabaseUrl&&settings.supabaseKey) saveConfigToSB(settings.supabaseUrl,settings.supabaseKey,"users",n);
  }
  async function pwReset(id,pw){
    const n=users.map(u=>u.id===id?{...u,password:pw}:u);setUsers(n);await ss(S_USERS,n);
    if(settings.supabaseUrl&&settings.supabaseKey) saveConfigToSB(settings.supabaseUrl,settings.supabaseKey,"users",n);
  }
  async function toggleSave(company){
    setLeads(prev=>{
      const exists=prev.some(l=>l.name===company.name);
      let next;
      if(exists){
        next=prev.filter(l=>l.name!==company.name);
        if(settings.supabaseUrl&&settings.supabaseKey) sbDeleteRow(settings.supabaseUrl,settings.supabaseKey,"leads","name",company.name);
      } else {
        const lead={...company,ownerId:cu.username,ownerName:cu.displayName,activityLog:[]};
        const withLog=addLog(lead,"saved",cu);
        next=[...prev,withLog];
        if(settings.supabaseUrl&&settings.supabaseKey) sbUpsert(settings.supabaseUrl,settings.supabaseKey,"leads",{name:withLog.name,owner_id:withLog.ownerId,owner_name:withLog.ownerName,data:withLog},"name");
      }
      ss(S_LEADS,next);
      return next;
    });
  }
  // Batch save: atomically saves multiple leads at once — avoids stale state bug
  function batchSave(companies){
    setLeads(prev=>{
      let next=[...prev];
      const toSave=[];
      companies.forEach(company=>{
        if(!next.some(l=>l.name===company.name)){
          const lead={...company,ownerId:cu.username,ownerName:cu.displayName,activityLog:[]};
          const withLog=addLog(lead,"discovered",cu);
          next.push(withLog);
          toSave.push(withLog);
        }
      });
      if(toSave.length){
        ss(S_LEADS,next);
        if(settings.supabaseUrl&&settings.supabaseKey){
          toSave.forEach(l=>sbUpsert(settings.supabaseUrl,settings.supabaseKey,"leads",{name:l.name,owner_id:l.ownerId,owner_name:l.ownerName,data:l},"name"));
        }
      }
      return next;
    });
  }
  function logAct(company,action){setLeads(prev=>{const n=prev.map(l=>{if(l.name!==company.name)return l;const updated=addLog(l,action,cu);if(settings.supabaseUrl&&settings.supabaseKey)sbUpsert(settings.supabaseUrl,settings.supabaseKey,"leads",{name:updated.name,owner_id:updated.ownerId,owner_name:updated.ownerName,data:updated},"name");return updated;});ss(S_LEADS,n);return n;});}
  function isSaved(name){return leads.some(l=>l.name===name);}
  function goEnrich(c,i){setETarget(c);setEIdx(i||0);logAct(c,"enriched");setView("enrich");}
  function goOutreach(c){setOTarget(c);setView("outreach");}

  const isAdmin=cu?.role==="admin";
  const NAV=[{id:"discover",label:"Discover",icon:<Search size={13}/>},{id:"saved",label:`${isAdmin?"All leads":"My leads"} (${isAdmin?leads.length:leads.filter(l=>l.ownerId===cu?.username).length})`,icon:<Bookmark size={13}/>},...(isAdmin?[{id:"settings",label:"Settings",icon:<Settings size={13}/>}]:[])];

  if(!ready)return <div className="flex items-center justify-center min-h-screen"><Loader2 size={20} className="animate-spin text-slate-400"/></div>;
  if(!cu)return <Login onLogin={login}/>;

  return(
    <div style={{fontFamily:"'DM Sans','Helvetica Neue',sans-serif"}} className="min-h-screen bg-slate-50">
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600&display=swap" rel="stylesheet"/>
      <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3"><div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center"><Sparkles size={14} className="text-white"/></div><div><span className="font-semibold text-slate-800 text-sm">Evolve</span><span className="font-semibold text-indigo-600 text-sm"> ESolutions</span><span className="text-slate-400 text-xs ml-2">· AI Client Sourcing</span></div></div>
        <div className="flex items-center gap-1">
          {NAV.map(n=><button key={n.id} onClick={()=>setView(n.id)} className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${view===n.id?"bg-slate-800 text-white":"text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`}>{n.icon}{n.label}</button>)}
          <div className="w-px h-4 bg-slate-200 mx-2"/>
          <div className="flex items-center gap-2 px-1"><Av name={cu.displayName||cu.username} idx={0} role={cu.role}/><div className="hidden sm:block"><div className="text-xs font-medium text-slate-700">{cu.displayName}</div><div className={`text-xs capitalize ${isAdmin?"text-indigo-500":"text-slate-400"}`}>{isAdmin?"Admin":"Account manager"}</div></div></div>
          <button onClick={logout} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-lg border border-slate-200 hover:border-red-200 ml-1"><LogOut size={12}/>Sign out</button>
        </div>
      </div>

      {view==="discover"&&<Discover leads={leads} onSave={toggleSave} onBatchSave={batchSave} onEnrich={goEnrich} onOutreach={goOutreach} cu={cu} niches={dynNiches} industries={dynIndustries}/>}
      {view==="saved"&&<Saved leads={leads} onSave={toggleSave} onEnrich={goEnrich} onOutreach={goOutreach} cu={cu}/>}
      {view==="settings"&&isAdmin&&<SettingsView settings={settings} onSave={saveSettings} users={users} onAdd={addUser} onRemove={removeUser} onPwReset={pwReset} cu={cu} niches={dynNiches} industries={dynIndustries} onSaveNiches={saveNiches} onSaveIndustries={saveIndustries}/>}
      {view==="enrich"&&eTarget&&<Enrich company={eTarget} idx={eIdx} onBack={()=>setView("discover")} onOutreach={goOutreach} onSave={toggleSave} isSaved={isSaved(eTarget.name)} cu={cu} settings={settings}/>}
      {view==="outreach"&&oTarget&&<Outreach company={oTarget} onBack={()=>setView("discover")} onSave={toggleSave} isSaved={isSaved(oTarget.name)} cu={cu} onLogAct={logAct} settings={settings}/>}
    </div>
  );
}
