import { useState, useEffect, useRef } from "react";
import {
  Search, Mail, Bookmark, BookmarkCheck, Loader2, Sparkles,
  ArrowLeft, Copy, RefreshCw, AlertCircle, Phone, Linkedin,
  TrendingUp, Users, Globe, Zap, CheckCircle2, BarChart2,
  Target, Trash2, FileText, Settings, Download, Play, Square,
  Key, Database, Mic, LogOut, UserPlus, Shield, User, Eye, Plus, Briefcase,
  EyeOff, Clock, Activity, ChevronDown, ChevronRight, Tag, X, Pencil, Check, Send
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
  {id:"07",label:"C-Suite & Technical Leadership",subs:["CTO - Chief Technology Officer","CIO - Chief Information Officer","CISO - Chief Information Security Officer","VP Engineering / Head of Engineering","CPO - Chief Product Officer","CDO - Chief Data Officer","Engineering Director / Principal Engineer","Head of Platform / Head of Architecture"]},
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
  {id:"fast",label:"Fast",days:"21d",steps:[
    {day:1, type:"email",label:"Cold intro"},
    {day:3, type:"email",label:"Follow-up #1"},
    {day:6, type:"email",label:"Value add - hiring trend"},
    {day:9, type:"call", label:"Call attempt"},
    {day:11,type:"email",label:"Case study"},
    {day:14,type:"email",label:"Follow-up #2"},
    {day:17,type:"linkedin",label:"LinkedIn connect"},
    {day:21,type:"email",label:"Break-up"},
  ]},
  {id:"standard",label:"Standard",days:"35d",steps:[
    {day:1, type:"email",   label:"Cold intro"},
    {day:3, type:"email",   label:"Follow-up #1"},
    {day:7, type:"email",   label:"Value add - hiring trend"},
    {day:10,type:"call",    label:"Call attempt"},
    {day:13,type:"email",   label:"Case study"},
    {day:16,type:"linkedin",label:"LinkedIn connect"},
    {day:19,type:"email",   label:"Follow-up #2"},
    {day:22,type:"email",   label:"Job-specific hook"},
    {day:26,type:"call",    label:"Call attempt #2"},
    {day:30,type:"email",   label:"Referral ask"},
    {day:35,type:"email",   label:"Break-up"},
  ]},
  {id:"nurture",label:"Nurture",days:"60d",steps:[
    {day:1, type:"email",   label:"Cold intro"},
    {day:3, type:"email",   label:"Follow-up #1"},
    {day:7, type:"email",   label:"Value add - hiring trend"},
    {day:10,type:"call",    label:"Call attempt #1"},
    {day:14,type:"email",   label:"Case study"},
    {day:18,type:"linkedin",label:"LinkedIn connect"},
    {day:22,type:"email",   label:"Follow-up #2"},
    {day:26,type:"email",   label:"Job-specific hook"},
    {day:30,type:"call",    label:"Call attempt #2"},
    {day:35,type:"email",   label:"Insight share"},
    {day:40,type:"email",   label:"Referral ask"},
    {day:45,type:"linkedin",label:"LinkedIn message"},
    {day:50,type:"email",   label:"Follow-up #3"},
    {day:55,type:"call",    label:"Call attempt #3"},
    {day:60,type:"email",   label:"Break-up"},
  ]},
];
const EMAIL_TYPES = [["intro","Cold intro"],["followup","Follow-up"],["casestudy","Case study"],["value","Value add"],["breakup","Break-up"]];
const DEFAULT_ADMIN   = {id:"evadmin",username:"evadmin",password:"evolve2024",displayName:"Admin",title:"Administrator",email:"admin@evolveesolutions.com",phone:"925-252-5700",role:"admin",createdAt:new Date().toISOString()};

// ── Storage ──
// ── Supabase credentials — from Vercel env vars (VITE_ prefix baked in at build) ──
// Safe env var access — works in Vite builds AND direct module load
const ENV_SB_URL = (()=>{ try{ return import.meta.env.VITE_SUPABASE_URL||""; }catch{ return ""; } })();
const ENV_SB_KEY = (()=>{ try{ return import.meta.env.VITE_SUPABASE_KEY||""; }catch{ return ""; } })();

// ── Adaptive storage - window.storage in Claude.ai, localStorage on Vercel ──
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
async function sbSaveOutreach(url,key,leadName,ownerId,ownerName,sequenceType,steps,campaignId=null,contactCount=0){
  if(!url||!key)return;
  const record={
    lead_name:leadName,
    owner_id:ownerId,
    owner_name:ownerName||ownerId,
    sequence_type:sequenceType,
    steps,
    reply_campaign_id:campaignId||null,
    contact_count:contactCount,
    pushed_at:campaignId?new Date().toISOString():null,
    created_at:new Date().toISOString(),
  };
  await sbReq(`${url}/rest/v1/outreach`,key,"POST",record);
}

// ── Supabase: import_queue helpers ──
async function sbSaveImportRows(url,key,rows){
  if(!url||!key||!rows.length)return;
  // Upsert each row individually (simple, small batches)
  for(const row of rows){
    await sbReq(`${url}/rest/v1/import_queue`,key,"POST",row);
  }
}
async function sbLoadImportQueue(url,key){
  if(!url||!key)return[];
  const rows=await sbReq(`${url}/rest/v1/import_queue?status=eq.pending&order=created_at.asc&select=*`,key);
  return rows||[];
}
async function sbMarkImportDone(url,key,id){
  if(!url||!key)return;
  await sbReq(`${url}/rest/v1/import_queue?id=eq.${id}`,key,"PATCH",{status:"done",processed_at:new Date().toISOString()});
}
async function sbDeleteImportRow(url,key,id){
  if(!url||!key)return;
  await sbReq(`${url}/rest/v1/import_queue?id=eq.${id}`,key,"DELETE");
}

// ── Supabase: load outreach history for a lead ──
async function sbLoadOutreach(url,key,leadName){
  if(!url||!key)return[];
  const rows=await sbReq(`${url}/rest/v1/outreach?lead_name=eq.${encodeURIComponent(leadName)}&select=*&order=created_at.desc`,key);
  return rows||[];
}

// ── Apollo.io enrichment (via Vercel proxy - Apollo blocks direct browser calls) ──
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
async function apolloSearchOrgs(industry,size,location,apiKey){
  if(!apiKey)throw new Error("No Apollo API key");
  // Map our size labels to Apollo employee ranges
  const sizeMap={"Startup (1–50)":{min:1,max:50},"SMB (51–250)":{min:51,max:250},"Mid-market (251–1000)":{min:251,max:1000},"Enterprise (1000+)":{min:1000,max:100000}};
  const sizeRange=size?sizeMap[size]:null;

  // Always restrict to USA unless a specific country is mentioned in location
  // Use organization_locations for country-level filter (most reliable)
  // Use q_organization_locations for city/state level filter
  const hasNonUSCountry=location&&/(uk|united kingdom|canada|australia|india|germany|france|europe)/i.test(location);
  const countryFilter=hasNonUSCountry?[]:[location&&location.trim()?`${location.trim()}, United States`:"United States"];

  const body={
    page:1,per_page:5,
    q_organization_keyword_tags:[industry],
    organization_locations:countryFilter,  // country-level restriction
    ...(location&&location.trim()?{q_organization_locations:[location.trim()]}:{}), // city/state refinement
    ...(sizeRange?{organization_num_employees_ranges:[`${sizeRange.min},${sizeRange.max}`]}:{}),
  };
  return apolloProxy(apiKey,"/api/v1/organizations/search",body);
}

async function apolloFindContacts(domain,apiKey){
  if(!apiKey)throw new Error("No Apollo API key");
  // Step 1: Search for decision makers at this domain
  const searchRes=await apolloProxy(apiKey,"/api/v1/mixed_people/api_search",{
    q_organization_domains:domain, // must be string, not array
    person_titles:["CEO","Chief Executive Officer","CFO","Chief Financial Officer","COO","Chief Operating Officer","President","Founder","Co-Founder","Managing Director","General Manager","VP Operations","VP Finance","Owner","Director of Operations","Head of Operations"],
    per_page:5,
    page:1,
  });
  const found=(searchRes?.people||[]).slice(0,3);
  if(!found.length)return {people:[]};

  // Step 2: Enrich each person via people/match (Basic plan: full name + LinkedIn + email)
  const enriched=await Promise.all(found.map(async p=>{
    try{
      // Cache by Apollo person ID - avoids re-charging credits if same person looked up again
      const cacheKey=`apollo_person_${p.id}`;
      let res;
      try{const cached=localStorage.getItem(cacheKey);res=cached?JSON.parse(cached):null;}catch{res=null;}
      if(!res){
        // 1 credit for work email. phone_numbers[] included free if Apollo has them on record.
        // Never use reveal_phone_number=true (8 extra credits) or reveal_personal_emails=true.
        res=await apolloProxy(apiKey,`/api/v1/people/match?id=${p.id}`);
        try{localStorage.setItem(cacheKey,JSON.stringify(res));}catch{}
      }
      const ep=res?.person||{};

      // Basic plan returns full last_name (not obfuscated)
      const name=[ep.first_name,ep.last_name].filter(Boolean).join(" ")||ep.name||p.first_name||"Unknown";
      const title=ep.title||p.title||"";
      const orgName=ep.organization?.name||"";

      // Basic plan returns linkedin_url directly
      const linkedin=ep.linkedin_url||(
        name!=="Unknown"
          ?`https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(`${name} ${orgName}`.trim())}`
          :null
      );

      // Phone: try person direct/mobile first, then fall back to org HQ phone (all free, no extra credit)
      const bestPhone=ep.phone_numbers?.find(n=>n.type==="direct_phone")||
                      ep.phone_numbers?.find(n=>n.type==="mobile_phone")||
                      ep.phone_numbers?.[0];
      const orgPhone=ep.organization?.phone||null;
      const phone=bestPhone?.raw_number||bestPhone?.sanitized_number||null;
      const phoneType=bestPhone?.type?.replace(/_/g," ")||null;

      return {
        name,title,
        email:ep.email||null,
        emailType:ep.email?(ep.email.includes(domain)?"Work":"Personal"):null,
        phone:phone||(orgPhone?orgPhone:null),
        phoneType:phone?phoneType:(orgPhone?"HQ":null),
        linkedin,
        source:"Apollo",
      };
    }catch(e){
      // Fallback: use search result data only
      const name=p.first_name||"Unknown";
      return {
        name,title:p.title||"",
        email:null,phone:null,phoneType:null,
        linkedin:name!=="Unknown"
          ?`https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(name)}`
          :null,
        source:"Apollo",
      };
    }
  }));
  return {people:enriched};
}

// ── Reply.io campaign push (via Vercel proxy to avoid CORS) ──
// Convert plain text email body to HTML preserving line breaks and paragraphs
function emailToHtml(text){
  if(!text)return "";
  return text
    .split(/\n\n+/) // split on blank lines = paragraph breaks
    .map(para=>`<p>${para.replace(/\n/g,"<br>")}</p>`) // single newlines = <br>
    .join("");
}
// NOTE: Requires a Reply.io API key - get from Reply.io → Settings → API → Create Key (scopes: campaigns:all + leads:all)
async function replyProxy(apiKey,target,body,method="POST"){
  const r=await fetch("/api/reply",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({target,body,apiKey,method}),
  });
  const text=await r.text();
  let d={};try{d=JSON.parse(text);}catch{}
  if(!r.ok)throw new Error(d.error||d.message||`Reply.io ${r.status}: ${text.slice(0,200)}`);
  return d;
}
async function replyPushCampaign(apiKey,campaignName,contacts,emailSteps,campaignId){
  // Reply.io v1 API:
  // - Campaigns CANNOT be created via API - must pre-exist in Reply.io UI
  // - Contacts are pushed via POST /people with campaignId in the body
  // - campaignId must be passed in from user selection
  if(!apiKey)throw new Error("No Reply.io API key - get one from Reply.io → Settings → API");
  if(!campaignId)throw new Error("No Reply.io campaign selected. Choose a campaign from the dropdown below.");

  // Push each valid contact to the campaign
  const validContacts=contacts.filter(c=>c.email&&c.email!=="Not found"&&c.email!==null&&c.email.includes("@"));
  if(!validContacts.length)throw new Error("No contacts with valid email addresses to push.");

  let addedCount=0;
  const errors=[];
  for(const ct of validContacts){
    const cleanName=(ct.name&&ct.name!=="Unknown")?ct.name.trim():"";
    const parts=cleanName.split(" ").filter(Boolean);
    const emailPrefix=ct.email?.split("@")[0]?.split(/[._+-]/)[0]||"";
    const emailFirst=emailPrefix?emailPrefix.charAt(0).toUpperCase()+emailPrefix.slice(1).toLowerCase():"";
    try{
      // POST /people with campaignId creates person AND pushes to campaign in one call
      await replyProxy(apiKey,"/people",{
        email:ct.email,
        firstName:parts[0]||emailFirst||"",
        lastName:parts.slice(1).join(" ")||"",
        company:ct.company||"",
        phone:(ct.phone&&ct.phone!=="Not found")?ct.phone:"",
        linkedInProfile:ct.linkedin||"",
        campaignId:Number(campaignId),
      });
      addedCount++;
    }catch(e){
      console.warn(`Reply.io: could not add ${ct.email}:`,e.message);
      errors.push(ct.email);
    }
  }
  return {campaignId, addedCount, totalContacts:validContacts.length, errors};
}

// Fetch Reply.io campaigns list for the dropdown
async function replyGetCampaigns(apiKey){
  if(!apiKey)return [];
  try{
    const list=await replyProxy(apiKey,"/campaigns","","GET");
    return Array.isArray(list)?list:[];
  }catch{return [];}
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
// ── Claude AI with custom messages (supports assistant pre-fill to force JSON) ──
async function aiMessages(messages,maxTokens=600){
  const headers={"Content-Type":"application/json","anthropic-dangerous-direct-browser-access":"true"};
  if(_anthropicKey){headers["x-api-key"]=_anthropicKey;headers["anthropic-version"]="2023-06-01";}
  const body={model:"claude-sonnet-4-5",max_tokens:maxTokens,messages};
  const r=await fetch(ANTHROPIC_API,{method:"POST",headers,body:JSON.stringify(body)});
  const d=await r.json();
  if(d.error)throw new Error(d.error.message||"API error");
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
function LogPanel({log=[],isOwner=false,isAdmin=false}){
  if(!isAdmin&&!isOwner)return null;
  const [open,setOpen]=useState(false);
  if(!log.length)return null;
  const fmt=ts=>new Date(ts).toLocaleString("en-US",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"});
  const ic={saved:<Bookmark size={10}/>,enriched:<TrendingUp size={10}/>,discovered:<Search size={10}/>,"outreach generated":<Mail size={10}/>};
  const getIcon=(action)=>{
    if(ic[action])return ic[action];
    if(action.startsWith("pushed to Reply.io"))return<Send size={10}/>;
    return<Activity size={10}/>;
  };
  return(
    <div className="mt-3 pt-3 border-t border-slate-100">
      <button onClick={()=>setOpen(p=>!p)} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600">
        <Activity size={11}/>{log.length} event{log.length!==1?"s":""}
        {open?<ChevronDown size={11}/>:<ChevronRight size={11}/>}
      </button>
      {open&&<div className="mt-2 space-y-2">{[...log].reverse().map((e,i)=>{
          const isReply=e.action.startsWith("pushed to Reply.io");
          return(<div key={i} className={`flex items-start gap-2 text-xs rounded-lg p-2 ${isReply?"bg-emerald-50 border border-emerald-100":"bg-slate-50"}`}>
            <span className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isReply?"bg-emerald-100 text-emerald-600":"bg-slate-200 text-slate-500"}`}>{getIcon(e.action)}</span>
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-slate-700">{e.user}</span>
              <span className="text-slate-400 mx-1">·</span>
              <span className={`break-words ${isReply?"text-emerald-800 font-medium":"text-slate-500"}`}>{e.action}</span>
            </div>
            <span className="text-slate-400 flex-shrink-0 whitespace-nowrap">{fmt(e.timestamp)}</span>
          </div>);
        })}</div>}
    </div>
  );
}

// ── Reply.io Tags ──
function ReplyTags({user}){
  const [copied,setCopied]=useState("");
  const sig=`${user.displayName}\n${user.title||"Account Manager"}\nEvolve ESolutions\n${user.email||""} | ${user.phone||""}\nevolveesolutions.com`;
  const tags=[{key:"{{firstName}}",val:"[Lead first name]",lbl:"Lead first name"},{key:"{{accountSignature}}",val:"[Mailbox signature]",lbl:"Mailbox signature"}];
  function cp(val,k){navigator.clipboard.writeText(val);setCopied(k);setTimeout(()=>setCopied(""),2000);}
  return(
    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-5">
      <div className="flex items-center gap-2 mb-3"><Tag size={13} className="text-indigo-500"/><span className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">Reply.io merge tags</span><span className="text-xs text-indigo-400">— paste into Reply.io template fields</span></div>
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.map(t=><button key={t.key} onClick={()=>cp(t.key,t.key)} title={`Copies tag: ${t.key}\nValue: ${t.val}`} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-all ${copied===t.key?"bg-indigo-600 text-white border-indigo-600":"bg-white text-indigo-700 border-indigo-200 hover:border-indigo-400"}`}>{copied===t.key?<CheckCircle2 size={11}/>:<Copy size={11}/>}{t.key}</button>)}
        <button onClick={()=>cp(sig,"sig")} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${copied==="sig"?"bg-indigo-600 text-white border-indigo-600":"bg-white text-indigo-600 border-indigo-200 hover:border-indigo-400"}`}>{copied==="sig"?<CheckCircle2 size={11}/>:<Copy size={11}/>}Copy signature text</button>
      </div>
      <details><summary className="text-xs text-indigo-400 cursor-pointer hover:text-indigo-600">Preview your signature</summary><pre className="mt-2 text-xs text-indigo-800 bg-white border border-indigo-100 rounded-lg p-3 whitespace-pre-wrap font-sans">{sig}</pre></details>
      <p className="text-xs text-indigo-400 mt-2">Click any tag → copy it → paste into Reply.io's template editor. Reply.io auto-replaces with each sender's real details at send time.</p>
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
          {/* Left - niche list */}
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

          {/* Right - edit selected niche */}
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
        <p className="text-xs text-slate-400">{settings?.supabaseUrl?"Changes save to Supabase and apply immediately for all users.":"No Supabase connected - changes save locally only."}</p>
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
  const [f,setF]=useState({anthropicKey:settings.anthropicKey||"",elevenLabsKey:settings.elevenLabsKey||"",elevenLabsVoiceId:settings.elevenLabsVoiceId||"pNInz6obpgDQGcFmaJgB",supabaseUrl:settings.supabaseUrl||"",supabaseKey:settings.supabaseKey||"",apolloKey:settings.apolloKey||"",replyApiKey:settings.replyApiKey||"",serpKey:settings.serpKey||"",hunterKey:settings.hunterKey||""});
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
      <H1 title="Settings" sub="Admin only - API keys, user management, and niche configuration."/>

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
              <p className="text-xs text-indigo-700">On <span className="font-semibold">Vercel</span>, the Anthropic key is required for AI to work. In <span className="font-semibold">Claude.ai</span>, it's optional - AI runs automatically.</p>
            </div>
            <F lbl="Anthropic API key" k="anthropicKey" ph="sk-ant-..." secret hint="console.anthropic.com → API Keys - required on Vercel, optional in Claude.ai"/>
            <F lbl="ElevenLabs Voice ID" k="elevenLabsVoiceId" ph="pNInz6obpgDQGcFmaJgB" hint="Default: Adam. Find others at elevenlabs.io/voice-library"/>
            {ENV_SB_URL?(
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2.5 mb-2">
                <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0"/>
                <span className="text-xs text-emerald-700 font-medium">Supabase connected via Vercel environment variables</span>
              </div>
            ):(
              <div className="space-y-3">
                <F lbl="Supabase URL" k="supabaseUrl" ph="https://xxxx.supabase.co"/>
                <F lbl="Supabase anon key" k="supabaseKey" ph="eyJ..." secret/>
              </div>
            )}
            <F lbl="Apollo.io API key" k="apolloKey" ph="..." secret hint="apollo.io → Settings → API Keys (coming soon)"/>
            <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-3">
              <p className="text-xs text-amber-700 font-semibold mb-1">⚠️ Reply.io API key required</p>
              <p className="text-xs text-slate-500">Get your API key from Reply.io → Settings → API → copy the key below.</p>
            </div>
            <F lbl="Reply.io API key" k="replyApiKey" ph="..." secret hint="Reply.io → Settings → API → copy key"/>
            <div className="border-t border-slate-100 my-4"/>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Discover Enhancement</p>
            <F lbl="SerpAPI key" k="serpKey" ph="..." secret hint="serpapi.com → Dashboard → API Key - enables real Google search results in Discover ($50/mo, 5k searches)"/>
            <F lbl="Hunter.io API key" k="hunterKey" ph="..." secret hint="hunter.io → API → API Key - verifies contact emails before pushing to Reply.io"/>
            <button onClick={saveKeys} className="w-full py-2.5 rounded-xl bg-slate-800 text-white text-sm font-medium hover:bg-slate-700 flex items-center justify-center gap-2">{saved?<><CheckCircle2 size={14}/>Saved!</>:<><Key size={14}/>Save API keys</>}</button>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
            <h3 className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-3 flex items-center gap-1.5"><Database size={13}/>Supabase - run once in SQL editor</h3>
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

// ══ IMPORT TAB ══
function ImportTab({leads,onBatchSave,cu,settings}){
  const PENDING_KEY="evolve_import_queue_v4";
  const MAX_PENDING=500;
  const [rows,setRows]=useState([{name:"",website:"",id:Date.now()}]); // editable table
  const [rowErrors,setRowErrors]=useState({}); // {rowId: "error message"}
  const [queue,setQueue]=useState([]); // persisted pending queue
  const [processing,setProcessing]=useState(false);
  const [procMsg,setProcMsg]=useState("");
  const [err,setErr]=useState("");

  // Load queue from localStorage + Supabase on mount
  useEffect(()=>{
    async function load(){
      const local=JSON.parse(localStorage.getItem(PENDING_KEY)||"[]");
      if(local.length){setQueue(local);return;}
      if(settings?.supabaseUrl&&settings?.supabaseKey){
        const sb=await sbLoadImportQueue(settings.supabaseUrl,settings.supabaseKey);
        if(sb.length){
          const mapped=sb.map(r=>({id:r.id,name:r.company_name,website:r.website||"",status:r.status,ownerId:r.owner_id,ownerName:r.owner_name,createdAt:r.created_at}));
          setQueue(mapped);
          localStorage.setItem(PENDING_KEY,JSON.stringify(mapped));
        }
      }
    }
    load();
  },[]);

  function saveQueue(q){
    setQueue(q);
    localStorage.setItem(PENDING_KEY,JSON.stringify(q));
  }

  function addRow(){setRows(p=>[...p,{name:"",website:"",id:Date.now()}]);}
  function removeRow(id){setRows(p=>p.filter(r=>r.id!==id));}
  function updateRow(id,field,val){
    setRows(p=>p.map(r=>r.id===id?{...r,[field]:val}:r));
    if(field==="name"&&val.trim()){
      const nameLC=val.trim().toLowerCase();
      const isDupLead=leads.some(l=>l.name.toLowerCase()===nameLC);
      const isDupQueue=queue.some(q=>q.name.toLowerCase()===nameLC);
      if(isDupLead){
        setRowErrors(p=>({...p,[id]:"Already exists as a lead"}));
      } else if(isDupQueue){
        setRowErrors(p=>({...p,[id]:"Already in pending queue"}));
      } else {
        setRowErrors(p=>{const n={...p};delete n[id];return n;});
      }
    } else if(field==="name"&&!val.trim()){
      setRowErrors(p=>{const n={...p};delete n[id];return n;});
    }
  }

  function parseCSV(text){
    const lines=text.trim().split(/\r\n|\r|\n/).filter(Boolean);
    if(!lines.length)return[];
    // Detect header row
    const first=lines[0].toLowerCase();
    const hasHeader=first.includes("company")||first.includes("name")||first.includes("website");
    const dataLines=hasHeader?lines.slice(1):lines;
    return dataLines.map(line=>{
      const parts=line.split(",").map(p=>p.trim().replace(/^"|"$/g,""));
      return{name:parts[0]||"",website:parts[1]||"",id:Date.now()+Math.random()};
    }).filter(r=>r.name&&r.name.trim());
  }

  function handleFileUpload(e){
    const file=e.target.files?.[0];
    if(!file)return;
    const reader=new FileReader();
    reader.onload=ev=>{
      const parsed=parseCSV(ev.target.result);
      if(parsed.length){setRows(p=>[...p.filter(r=>r.name),...parsed]);setErr("");}
      else setErr("Could not parse CSV. Ensure columns are: company_name, website");
    };
    reader.readAsText(file);
    e.target.value="";
  }

  async function saveToPending(){
    const isValidDomain=w=>{
      if(!w||!w.trim())return true; // website is optional — blank is fine
      const d=w.trim().replace(/https?:\/\//,"").replace(/^www\./,"").replace(/\/.*/,"").toLowerCase().trim();
      return d.length>3&&d.includes(".")&&!d.includes(" ")&&/^[a-z0-9][a-z0-9\-\.]+\.[a-z]{2,}$/.test(d);
    };
    const valid=rows.filter(r=>r.name.trim());
    if(!valid.length){setErr("Add at least one company name.");return;}
    // Validate websites — highlight invalid ones
    const invalidWebsites=valid.filter(r=>r.website&&!isValidDomain(r.website));
    if(invalidWebsites.length){
      setErr(`Invalid website${invalidWebsites.length>1?"s":""}: ${invalidWebsites.map(r=>`"${r.website}" (${r.name})`).join(", ")} - use format: company.com`);
      return;
    }
    const alreadyInQueue=queue.map(q=>q.name.toLowerCase());
    const alreadyLead=leads.map(l=>l.name.toLowerCase());
    // Separate duplicates from fresh rows
    const dupes=valid.filter(r=>alreadyInQueue.includes(r.name.trim().toLowerCase())||alreadyLead.includes(r.name.trim().toLowerCase()));
    const fresh=valid.filter(r=>!alreadyInQueue.includes(r.name.trim().toLowerCase())&&!alreadyLead.includes(r.name.trim().toLowerCase()));
    // Remove duplicate rows from the entry table immediately
    if(dupes.length){
      setRows(p=>p.filter(r=>!dupes.some(d=>d.name.trim().toLowerCase()===r.name.trim().toLowerCase())));
      const dupeNames=dupes.map(d=>d.name).join(", ");
      if(!fresh.length){
        setErr(`All companies already exist: ${dupeNames}. Duplicate rows removed.`);
        return;
      }
      setErr(`Duplicates removed: ${dupeNames}. Saving ${fresh.length} new ${fresh.length===1?"company":"companies"}.`);
    }
    if(!fresh.length){setErr("All companies already exist in your queue or leads.");return;}
    if(queue.length+fresh.length>MAX_PENDING){setErr(`Queue would exceed ${MAX_PENDING} max. Remove some first.`);return;}
    const newItems=fresh.map(r=>({
      id:`local_${Date.now()}_${Math.random()}`,
      name:r.name.trim(),
      website:(r.website||"").trim().replace(/https?:\/\//,"").replace(/^www\./,"").replace(/\/.*/,"").toLowerCase().trim(),
      status:"pending",ownerId:cu.username,ownerName:cu.displayName,
      createdAt:new Date().toISOString(),
    }));
    const newQ=[...queue,...newItems];
    saveQueue(newQ);
    // Save to Supabase
    if(settings?.supabaseUrl&&settings?.supabaseKey){
      await sbSaveImportRows(settings.supabaseUrl,settings.supabaseKey,newItems.map(r=>({company_name:r.name,website:r.website,status:"pending",owner_id:r.ownerId,owner_name:r.ownerName})));
    }
    setRows([{name:"",website:"",id:Date.now()}]);
    setErr("");
    setProcMsg(`Added ${newItems.length} companies to pending queue.`);
    setTimeout(()=>setProcMsg(""),3000);
  }

  async function processNext(n=2){
    const pending=queue.filter(r=>r.status==="pending").slice(0,n);
    if(!pending.length){setErr("No pending companies to process.");return;}
    setProcessing(true);setProcMsg(`Processing ${pending.length} companies...`);setErr("");
    const processedIds=[];
    const newLeads=[];
    for(const row of pending){
      const lead={
        name:row.name,industry:"",size:"",location:"",website:row.website||"",
        signal:"Imported company - run Enrich for details",fitScore:70,fitReason:"Imported lead",
        source:{channel:"Import",method:"CSV",label:""},stage:"new",
      };
      newLeads.push(lead);
      processedIds.push(row.id);
      // Delete from Supabase immediately
      if(settings?.supabaseUrl&&settings?.supabaseKey){
        await sbDeleteImportRow(settings.supabaseUrl,settings.supabaseKey,row.id);
      }
    }
    // Remove converted rows from queue entirely (not just mark done)
    const remaining=queue.filter(q=>!processedIds.includes(q.id));
    saveQueue(remaining);
    onBatchSave(newLeads);
    setProcessing(false);
    setProcMsg(`${newLeads.length} ${newLeads.length===1?"company":"companies"} converted to leads. Find them in All Leads > New.`);
    setTimeout(()=>setProcMsg(""),5000);
  }

  const [selectedIds,setSelectedIds]=useState(new Set());

  function toggleSelect(id){
    setSelectedIds(prev=>{const n=new Set(prev);n.has(id)?n.delete(id):n.add(id);return n;});
  }
  function toggleSelectAll(){
    if(selectedIds.size===queue.length){setSelectedIds(new Set());}
    else{setSelectedIds(new Set(queue.map(r=>r.id)));}
  }
  function removeFromQueue(id){
    const updated=queue.filter(q=>q.id!==id);
    saveQueue(updated);
    setSelectedIds(prev=>{const n=new Set(prev);n.delete(id);return n;});
    if(settings?.supabaseUrl&&settings?.supabaseKey) sbDeleteImportRow(settings.supabaseUrl,settings.supabaseKey,id);
  }
  function removeSelected(){
    const toRemove=[...selectedIds];
    const updated=queue.filter(q=>!toRemove.includes(q.id));
    saveQueue(updated);
    setSelectedIds(new Set());
    if(settings?.supabaseUrl&&settings?.supabaseKey){
      toRemove.forEach(id=>sbDeleteImportRow(settings.supabaseUrl,settings.supabaseKey,id));
    }
  }
  function clearAll(){
    if(!window.confirm(`Remove all ${queue.length} rows from queue? This cannot be undone.`))return;
    if(settings?.supabaseUrl&&settings?.supabaseKey){
      queue.forEach(r=>sbDeleteImportRow(settings.supabaseUrl,settings.supabaseKey,r.id));
    }
    saveQueue([]);
    setSelectedIds(new Set());
  }

  const pendingCount=queue.filter(r=>r.status==="pending").length;

  return(
    <div className="space-y-5">
      {/* Entry table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Add companies</h3>
            <p className="text-xs text-slate-500 mt-0.5">Type manually or upload a CSV. Columns: company_name, website (optional)</p>
          </div>
          <label className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:border-slate-400 cursor-pointer">
            <Download size={11}/>Upload CSV
            <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden"/>
          </label>
        </div>
        {/* Table */}
        <div className="rounded-xl border border-slate-200 overflow-hidden mb-3">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr><th className="px-3 py-2 text-left text-slate-500 font-medium w-8">#</th><th className="px-3 py-2 text-left text-slate-500 font-medium">Company name *</th><th className="px-3 py-2 text-left text-slate-500 font-medium">Website</th><th className="px-2 py-2 w-8"></th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row,i)=>(
                <tr key={row.id} className="hover:bg-slate-50">
                  <td className="px-3 py-1.5 text-slate-400">{i+1}</td>
                  <td className="px-3 py-1.5">
                    <input value={row.name} onChange={e=>updateRow(row.id,"name",e.target.value)} placeholder="Acme Corp" className={`w-full bg-transparent outline-none placeholder-slate-300 ${rowErrors[row.id]?"text-red-500":"text-slate-800"}`}/>
                    {rowErrors[row.id]&&<div className="text-xs text-red-400 mt-0.5">{rowErrors[row.id]}</div>}
                  </td>
                  <td className="px-3 py-1.5"><input value={row.website} onChange={e=>updateRow(row.id,"website",e.target.value)} placeholder="acme.com" className={`w-full bg-transparent outline-none placeholder-slate-300 ${row.website&&!/^[a-z0-9][a-z0-9\-\.]+\.[a-z]{2,}$/i.test(row.website.trim().replace(/https?:\/\//,"").replace(/^www\./,"").replace(/\/.*/,"").toLowerCase())?"text-red-500":"text-slate-600"}`}/></td>
                  <td className="px-2 py-1.5"><button onClick={()=>removeRow(row.id)} className="text-slate-300 hover:text-red-400"><X size={12}/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={addRow} className="flex items-center gap-1.5 text-xs text-slate-600 px-3 py-1.5 border border-slate-200 rounded-lg hover:border-slate-400"><Plus size={11}/>Add row</button>
          <button onClick={saveToPending} className="flex items-center gap-1.5 text-xs bg-slate-800 text-white px-3 py-1.5 rounded-lg hover:bg-slate-700"><Download size={11}/>Save to pending queue</button>
          <span className="text-xs text-slate-400 ml-auto">{rows.filter(r=>r.name.trim()).length} valid rows</span>
        </div>
        {err&&<p className="text-xs text-red-500 mt-2">{err}</p>}
        {procMsg&&<p className="text-xs text-emerald-600 mt-2">{procMsg}</p>}
      </div>

      {/* Pending queue */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Pending queue <span className="ml-1 text-xs text-slate-400">{pendingCount} / {MAX_PENDING}</span></h3>
            <p className="text-xs text-slate-500 mt-0.5">Click "Process next 2" to convert companies to leads. Enrich them one-by-one from the lead detail.</p>
          </div>
          <div className="flex items-center gap-2">
            {selectedIds.size>0&&<button onClick={removeSelected} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-medium hover:bg-red-100">
              <X size={11}/>Delete {selectedIds.size} selected
            </button>}
            {queue.length>0&&<button onClick={clearAll} className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-slate-500 rounded-xl text-xs font-medium hover:bg-slate-50">
              Clear all
            </button>}
            <button onClick={()=>processNext(2)} disabled={processing||!pendingCount} className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 text-white rounded-xl text-xs font-medium hover:bg-violet-700 disabled:opacity-50">
              {processing?<><Loader2 size={11} className="animate-spin"/>Processing...</>:<><Zap size={11}/>Process next 2</>}
            </button>
          </div>
        </div>
        {queue.length===0?(
          <p className="text-xs text-slate-400 text-center py-6">No companies in queue. Add companies above and save to pending.</p>
        ):(
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr><th className="px-3 py-2 w-8"><input type="checkbox" checked={selectedIds.size===queue.length&&queue.length>0} onChange={toggleSelectAll} className="rounded"/></th><th className="px-3 py-2 text-left text-slate-500 font-medium">Company</th><th className="px-3 py-2 text-left text-slate-500 font-medium">Website</th><th className="px-3 py-2 text-left text-slate-500 font-medium">Added by</th><th className="px-3 py-2 text-left text-slate-500 font-medium">Status</th><th className="px-2 py-2 w-8"></th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {queue.slice(0,50).map((row,i)=>(
                  <tr key={row.id||i} className={`hover:bg-slate-50 ${selectedIds.has(row.id)?"bg-blue-50":""} ${row.status==="done"?"opacity-50":""}`}>
                    <td className="px-3 py-2"><input type="checkbox" checked={selectedIds.has(row.id)} onChange={()=>toggleSelect(row.id)} onClick={e=>e.stopPropagation()} className="rounded"/></td>
                    <td className="px-3 py-2 font-medium text-slate-800">{row.name}</td>
                    <td className="px-3 py-2 text-slate-500">{row.website||"—"}</td>
                    <td className="px-3 py-2 text-slate-400">{row.ownerName||row.ownerId||"—"}</td>
                    <td className="px-3 py-2">
                      {row.status==="pending"&&<span className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">⏳ Pending</span>}
                      {row.status==="done"&&<span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">✓ Converted</span>}
                      {row.status==="error"&&<span className="inline-flex items-center gap-1 text-red-500 bg-red-50 px-2 py-0.5 rounded-full">✗ Error</span>}
                    </td>
                    <td className="px-2 py-2"><button onClick={e=>{e.stopPropagation();removeFromQueue(row.id);}} className="text-slate-300 hover:text-red-500 transition-colors" title="Remove this row"><X size={12}/></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {queue.length>50&&<p className="text-xs text-slate-400 text-center py-2">Showing first 50 of {queue.length}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

// ══ DISCOVER ══
function Discover({leads,onSave,onBatchSave,onEnrich,onOutreach,cu,niches:dynNiches,industries:dynIndustries,settings}){
  const nicheList=dynNiches||NICHES;
  const industryList=dynIndustries||INDUSTRIES;
  const [mode,setMode]=useState("industry");
  const [src,setSrc]=useState("ai"); // ai | web | apollo
  const [industry,setIndustry]=useState("");
  const [niche,setNiche]=useState("");
  const [subNiche,setSubNiche]=useState("");
  const [size,setSize]=useState("");const [loc,setLoc]=useState("");const [sigs,setSigs]=useState([]);const [loading,setLoading]=useState(false);const [results,setResults]=useState([]);const [err,setErr]=useState("");
  const myCount=leads.filter(l=>l.ownerId===cu.username).length;
  const selectedNiche=nicheList.find(n=>n.id===niche);
  function togSig(s){setSigs(p=>p.includes(s)?p.filter(x=>x!==s):[...p,s]);}
  function isSaved(n){return leads.some(l=>l.name===n);}
  function switchMode(m){setMode(m);setIndustry("");setNiche("");setSubNiche("");setResults([]);setErr("");setSrc("ai");}

  const searchLabel = mode==="industry"
    ? industry
    : selectedNiche ? `${selectedNiche.label}${subNiche?` - ${subNiche}`:""}` : "";

  const canSearch = mode==="industry" ? !!industry : mode==="niche" ? !!niche : false;

  // Companies to never include regardless of search mode
  const EXCLUDE_RULE="NEVER include: job boards (Indeed, LinkedIn, Glassdoor, ZipRecruiter, Monster, Reed, Totaljobs), recruitment agencies, staffing firms, RPO providers, headhunters, talent acquisition firms, HR outsourcing companies, or any business whose primary service is recruiting/hiring for other companies. Evolve ESolutions IS a recruitment firm - exclude all competitors.";
  const EXCLUDE_INDUSTRIES=["staffing","recruiting","human resources outsourcing","rpo","employment agency","headhunting","talent acquisition"];
  function isExcludedCompany(r){
    const name=(r.name||"").toLowerCase();
    const ind=(r.industry||"").toLowerCase();
    const site=(r.website||"").toLowerCase();
    // Exclude known job boards and staffing keywords
    const badKeywords=["staffing","recrui","headhunt","talent agency","job board","employment agency","manpower","adecco","randstad","hays ","michael page","robert half","kelly services","indeed","glassdoor","ziprecruiter","monster.com","totaljobs","reed.co","reed.com","rpo ","hr outsourc"];
    if(badKeywords.some(k=>name.includes(k)||site.includes(k)))return true;
    if(EXCLUDE_INDUSTRIES.some(k=>ind.includes(k)))return true;
    return false;
  }

  async function search(){
    if(!canSearch)return;setLoading(true);setResults([]);setErr("");
    const sig=sigs.length?sigs.join(", "):"actively hiring or growing";
    const target=mode==="industry"?`Industry: ${industry}`:`Niche: ${selectedNiche.label}${subNiche?`, sub-niche: ${subNiche}`:""}`;
    const now=new Date();
    const sixMonthsAgo=new Date(now);sixMonthsAgo.setMonth(now.getMonth()-6);
    const sinceDate=sixMonthsAgo.toLocaleDateString("en-US",{month:"long",year:"numeric"});
    const currentDate=now.toLocaleDateString("en-US",{month:"long",year:"numeric"});
    const existingNames=leads.map(l=>l.name).filter(Boolean);
    const excludeClause=existingNames.length>0?`\nEXCLUDE these companies (already in our leads): ${existingNames.join(", ")}`:""

    // ── Helper: robust JSON extraction from any Claude response ──
    function extractJSON(text){
      if(!text)return null;
      // Strip all markdown fencing first
      let t=text.replace(/```json/gi,"").replace(/```/g,"").trim();
      // 1. Direct parse
      try{const r=JSON.parse(t);if(Array.isArray(r)&&r.length)return r;}catch{}
      // 2. Find outermost [ ... ] - handles text before/after JSON
      const start=t.indexOf("[");const end=t.lastIndexOf("]");
      if(start>-1&&end>start){
        try{const r=JSON.parse(t.substring(start,end+1));if(Array.isArray(r)&&r.length)return r;}catch{}
      }
      // 3. Grab individual objects and wrap in array
      const objects=[];let depth2=0;let objStart=-1;
      for(let i=0;i<t.length;i++){
        if(t[i]==="{"){if(depth2===0)objStart=i;depth2++;}
        if(t[i]==="}"){depth2--;if(depth2===0&&objStart>-1){try{const o=JSON.parse(t.substring(objStart,i+1));if(o.name)objects.push(o);}catch{}objStart=-1;}}
      }
      if(objects.length)return objects;
      return null;
    }

    // ── Helper: save results ──
    function saveResults(parsed,label){
      if(!parsed?.length){setErr("Could not parse results. Try again.");setLoading(false);return;}
      const isValidWebsite=w=>w&&w.length>3&&w.includes(".")&&!w.includes(" ");
      const srcMethodMap={"ai":"AI Only","web":"AI + Web","apollo":"Apollo","serp":"SerpAPI"};
      const fresh=parsed.filter(r=>
        isValidWebsite(r.website)&&
        !leads.some(l=>l.name===r.name)&&
        !isExcludedCompany(r)
      ).map(r=>({...r,
        source:{channel:"Discover",method:srcMethodMap[src]||"AI Only",label:label||searchLabel},
        stage:"new",
      }));
      if(parsed.length>0&&fresh.length===0){setErr("All results already exist or have unverifiable websites. Try a different search.");setLoading(false);return;}
      const enriched=fresh.map(r=>({...r,website:r.website.replace(/https?:\/\//,"").replace(/^www\./,"").replace(/\/.*/,"").toLowerCase().trim(),searchMode:mode,searchLabel:label||searchLabel}));
      if(enriched.length){setResults(enriched);onBatchSave(enriched);}
      else setErr("All results already exist in your leads. Try a different search.");
    }

    try{
      // ── Mode 1: AI Only - Claude training knowledge ──
      if(src==="ai"){
        const prompt=`You are a B2B sales researcher for Evolve ESolutions (IT/HR/Healthcare/Legal/Financial Services recruitment, Pleasanton CA).

Find exactly 3 real companies matching:
- ${target}
- Size: ${size||"any"} | Location: ${loc||"any"} | Signal: ${sig}
- Buying signal must be from ${sinceDate} to ${currentDate} (last 6 months only)${excludeClause}

Rules:
- Return EXACTLY 3 companies (fewer if not enough match)
- Each must have a verifiable recent signal with month + year
- CRITICAL: Only include companies where you know the real website URL with certainty. If unsure of the domain, omit that company entirely.
- The website field must be a clean domain like "company.com" - no https://, no www., no paths.
- ${EXCLUDE_RULE}
- Output ONLY a raw JSON array, no markdown fences

[{"name":"","industry":"","size":"","location":"","website":"company.com","signal":"what happened + Month YYYY","fitScore":82,"fitReason":"why Evolve should call them now"}]`;
        const t=await ai(prompt,false,800);
        const parsed=extractJSON(t);
        saveResults(parsed);
      }

      // ── Mode 2: AI + Web Search - real-time signals ──
      else if(src==="web"){
        const prompt=`You are a B2B sales researcher for Evolve ESolutions (IT/HR/Healthcare/Legal/Financial Services recruitment, Pleasanton CA).
Search the web and find 3 REAL companies that match:
- ${target}
- Size: ${size||"any"} | Location: ${loc||"any"} | Signal: ${sig}
- Buying signal must be from the last 6 months - use web search to verify recency${excludeClause}

Rules:
- Use web search to verify each company is real and has a genuine recent signal
- Only include companies with a verified real website domain
- ${EXCLUDE_RULE}
- Output ONLY a raw JSON array

[{"name":"","industry":"","size":"","location":"","website":"company.com","signal":"what happened + Month YYYY","fitScore":82,"fitReason":"why Evolve should call them now"}]`;
        const t=await ai(prompt,true,800); // web search ON
        const parsed=extractJSON(t);
        saveResults(parsed);
      }

      // ── Mode 3: Apollo - verified company database + Claude signals ──
      else if(src==="apollo"){
        const s=await sg(S_SETTINGS);
        const apolloKey=s?.apolloKey;
        if(!apolloKey){setErr("Add Apollo API key in Settings to use Apollo search.");setLoading(false);return;}
        const searchTerm=mode==="industry"?industry:`${selectedNiche.label}${subNiche?` ${subNiche}`:""}`;
        const orgRes=await apolloSearchOrgs(searchTerm,size,loc,apolloKey);
        const orgs=(orgRes?.organizations||[]).slice(0,5);
        if(!orgs.length){setErr("No companies found in Apollo for those criteria. Try broader search terms.");setLoading(false);return;}

        // Build results directly from Apollo data (no parsing needed)
        // Then ask Claude (no web search) to add signal + fit reason per company
        const orgNames=orgs.map(o=>o.name).join(", ");
        const prompt=`You are a B2B sales researcher for Evolve ESolutions (IT/HR/Healthcare/Legal/Financial Services recruitment, Pleasanton CA).
Add a recent buying signal and fit assessment for each of these verified companies:
${orgNames}

Target: ${target} | Signal type: ${sig}
Rules:
- One entry per company, exactly as named above
- signal: most recent known hiring/growth/funding news with month+year if known
- fitScore: 60-95
- ${EXCLUDE_RULE}
- Output ONLY valid JSON array, no markdown, no explanation

[{"name":"","signal":"","fitScore":80,"fitReason":""}]`;
        const t=await ai(prompt,false,500); // no web search - short signal summaries only
        // Extract JSON - multiple strategies
        let signals={};
        try{
          const clean=t.split("```json").join("").split("```").join("").trim();
          const m=clean.match(/\[[\s\S]*\]/);
          const arr=JSON.parse(m?m[0]:clean);
          if(Array.isArray(arr))arr.forEach(a=>{if(a.name)signals[a.name]={signal:a.signal||"",fitScore:a.fitScore||75,fitReason:a.fitReason||""};});
        }catch{}

        // Build final results from Apollo data + Claude signals
        const parsed=orgs.map(o=>{
          const sig2=signals[o.name]||{signal:`${o.industry||searchTerm} company with ${o.estimated_num_employees||"unknown"} employees`,fitScore:72,fitReason:`Verified ${o.industry||searchTerm} company - potential staffing need`};
          return{
            name:o.name,
            industry:o.industry||searchTerm,
            size:o.estimated_num_employees?`${o.estimated_num_employees} employees`:size||"",
            location:o.city&&o.state?`${o.city}, ${o.state}`:loc||"",
            website:o.primary_domain||"",
            signal:sig2.signal,
            fitScore:sig2.fitScore,
            fitReason:sig2.fitReason,
          };
        }).filter(o=>o.website); // must have a real domain from Apollo
        if(!parsed.length){setErr("Apollo returned companies but none had verified domains. Try different criteria.");setLoading(false);return;}
        saveResults(parsed,`Apollo: ${searchTerm}`);
      }

      // ── Mode 4: SerpAPI - Real Google results ──
      else if(src==="serp"){
        const s=await sg(S_SETTINGS);
        const serpKey=s?.serpKey;
        if(!serpKey){setErr("Add SerpAPI key in Settings → Discover Enhancement to use SerpAPI search.");setLoading(false);return;}
        const searchTerm=mode==="industry"?industry:`${selectedNiche.label}${subNiche?` ${subNiche}`:""}`;
        const sig2=sigs.length?sigs.join(" OR "):"hiring OR funded OR expanding";
        const query=`${searchTerm} company ${sig2} ${loc?loc+", United States":"United States"} site:techcrunch.com OR site:crunchbase.com OR site:businesswire.com 2025`;
        const r=await fetch("/api/serp",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query,apiKey:serpKey,num:5})});
        const serpData=await r.json();
        if(!r.ok){setErr(`SerpAPI error: ${serpData.error}`);setLoading(false);return;}
        // Truncate snippets to keep token count low (max 120 chars each, 5 results)
        const snippets=(serpData.organic||[]).slice(0,5).map(o=>`- ${o.title.substring(0,60)}: ${(o.snippet||"").substring(0,120)} (${o.domain})`).join("\n");
        if(!snippets){setErr("No results found from SerpAPI. Try different search terms.");setLoading(false);return;}
        // Minimal prompt to reduce tokens and force JSON output
        const prompt=`Extract B2B companies from these search results for Evolve ESolutions (IT/HR/Healthcare recruitment).
Target: ${target}. Location: ${loc||"USA"}.${excludeClause}
${EXCLUDE_RULE}

${snippets}

JSON array only (no text before or after):
[{"name":"X","industry":"","size":"","location":"","website":"x.com","signal":"what + month year","fitScore":75,"fitReason":"why recruit here"}]`;
        // Use conversation format to force JSON - assistant pre-fill trick
        const msgs=[
          {role:"user",content:prompt},
          {role:"assistant",content:"["}
        ];
        const raw=await aiMessages(msgs,400);
        const t="["+raw; // prepend the [ we pre-filled
        // Robust extraction - find [ ... ] block anywhere in response
        let parsed=null;
        try{
          const clean=t.trim();
          // Try direct parse first
          if(clean.startsWith("["))parsed=JSON.parse(clean);
        }catch{}
        if(!parsed){
          // Find JSON array anywhere in response (handles markdown wrapping)
          const match=t.match(/\[[\s\S]*?\{[\s\S]*?\}[\s\S]*?\]/);
          if(match){try{parsed=JSON.parse(match[0]);}catch{}}
        }
        if(!parsed){
          // Last resort: find anything between outermost [ and ]
          const start=t.indexOf("[");const end=t.lastIndexOf("]");
          if(start>-1&&end>start){try{parsed=JSON.parse(t.substring(start,end+1));}catch{}}
        }
        // If Claude fails to return parseable JSON, build results from raw serp data
        if(!parsed||!parsed.length){
          const fallback=(serpData.organic||[]).slice(0,3).map(o=>{
            // Extract domain from link
            const dom=o.link?new URL(o.link).hostname.replace("www.",""):"";
            return {name:o.title?.split(/[-|:]/)[0]?.trim()||o.domain,industry:searchTerm,size:"",location:loc||"USA",website:dom,signal:o.snippet?.substring(0,120)||"Found in recent search results",fitScore:70,fitReason:`Matched ${searchTerm} search - verify fit before outreach`};
          }).filter(o=>o.website&&o.website.includes("."));
          if(fallback.length){parsed=fallback;console.log("SerpAPI: used fallback from raw results");}
        }
        saveResults(parsed,`SerpAPI: ${searchTerm}`);
      }

    }catch(e){
      const msg=e.message||"";
      if(msg.includes("credit")||msg.includes("balance")||msg.includes("quota")){
        setErr("Anthropic API credits exhausted - add credits at console.anthropic.com/billing then try again.");
      } else if(msg.includes("401")||msg.includes("invalid")||msg.toLowerCase().includes("auth")){
        setErr("Invalid Anthropic API key - check your key in Settings.");
      } else {
        setErr(`Search failed: ${msg||"Check API key in Settings."}`);
      }
    }
    setLoading(false);
  }

  return(
    <div className="max-w-4xl mx-auto px-6 py-8">
      <H1 title="Find your next clients" sub="AI searches the web and surfaces the best matches. Use Industry for broad searches or your 18 Niches for targeted prospecting."/>
      {myCount>0&&<div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2.5 mb-5"><CheckCircle2 size={14} className="text-indigo-500"/><span className="text-xs font-medium text-indigo-700">You have {myCount} saved lead{myCount!==1?"s":""}.</span></div>}

      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        {/* Mode toggle - Industry / Niche / Import */}
        <div className="flex items-center gap-2 mb-4 p-1 bg-slate-100 rounded-xl w-fit">
          {[["industry","Industry search"],["niche",`Niche search (${nicheList.length})`],["import","Import"]].map(([m,l])=>(
            <button key={m} onClick={()=>switchMode(m)} className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${mode===m?"bg-white text-slate-800 shadow-sm":"text-slate-500 hover:text-slate-700"}`}>{l}</button>
          ))}
        </div>

        {mode==="import"&&<ImportTab leads={leads} onBatchSave={onBatchSave} cu={cu} settings={settings}/>}

        {mode!=="import"&&<div>
        {/* Source selector */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-slate-400 font-medium">Source:</span>
          {[
            {k:"ai",    icon:"[AI]", label:"AI Only",   tip:"Claude training knowledge - fast, free"},
            {k:"web",   icon:"[Web]", label:"AI + Web",  tip:"Real-time web search - verified recent signals"},
            {k:"apollo",icon:"[Apl]", label:"Apollo",    tip:"Verified company database - most accurate"},
            {k:"serp",  icon:"[Srp]", label:"SerpAPI",   tip:"Real Google results - best buying signals (needs SerpAPI key)"},
          ].map(s=>(
            <button key={s.k} onClick={()=>setSrc(s.k)} title={s.tip}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${src===s.k?"bg-slate-800 text-white border-slate-800":"border-slate-200 text-slate-600 hover:border-slate-400 bg-white"}`}>
              <span>{s.icon}</span>{s.label}
            </button>
          ))}
          <span className="text-xs text-slate-400 ml-1">{src==="ai"?"Uses Claude's training data":src==="web"?"Searches the web for recent signals":src==="apollo"?"Searches Apollo's verified company database":"Real Google search results - freshest buying signals"}</span>
        </div>

        {/* Mode tabs now at top of section */}

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

        {/* Sub-niche selector - only in niche mode when a niche is selected */}
        {mode==="niche"&&selectedNiche&&(
          <div className="mb-4">
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide mb-1.5">Sub-niche <span className="text-slate-300 normal-case font-normal">(optional - narrows search further)</span></label>
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
        </div>}
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
                      {c.website&&<a href={`https://${c.website}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline ml-auto"><Globe size={10}/>{c.website}</a>}
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
// ══ COMPANY DETAIL — tabbed view wrapping Enrich + Outreach ══
function CompanyDetail({company,idx,onBack,onSave,isSaved,cu,settings,onLogAct,onStage}){
  const [tab,setTab]=useState("overview");
  const TABS=[["overview","Overview"],["enrich","Enrich"],["outreach","Outreach"]];
  const CLOSED_STAGES=["closed-won","closed-lost","closed-invalid"];
  const stage=company.stage||"new";

  return(
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-5">
        <button onClick={onBack} className="hover:text-slate-700 flex items-center gap-1"><ArrowLeft size={11}/>All leads</button>
        <span>/</span>
        <span className="text-slate-600 font-medium">{company.name}</span>
        <StageBadge stage={stage}/>
        <SourceBadge source={company.source} lead={company}/>
      </div>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-5">
        <div className="flex items-start gap-4">
          <Av name={company.name} idx={idx} lg/>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-xl font-semibold text-slate-800">{company.name}</h1>
              <Score s={company.fitScore}/>
            </div>
            <p className="text-sm text-slate-500">{company.industry}{company.size?` - ${company.size}`:""}{company.location?` - ${company.location}`:""}</p>
            {company.website&&<a href={`https://${company.website}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline mt-1"><Globe size={11}/>{company.website}</a>}
            {company.signal&&<p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-1.5 mt-2">{company.signal}</p>}
          </div>
          <div className="flex flex-col gap-2 flex-shrink-0">
            <div className="flex gap-2">
              <button onClick={()=>onSave(company)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${isSaved?"bg-slate-800 text-white border-slate-800":"border-slate-200 text-slate-700 hover:border-slate-400"}`}>
                {isSaved?<><BookmarkCheck size={12}/>Saved</>:<><Bookmark size={12}/>Save</>}
              </button>
            </div>
            {/* Stage move buttons */}
            <div className="flex flex-wrap gap-1">
              {stage!=="progress"&&!CLOSED_STAGES.includes(stage)&&<button onClick={()=>onStage(company.name,"progress")} className="px-2 py-1 text-xs border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50">Progress</button>}
              {!CLOSED_STAGES.includes(stage)&&<>
                <button onClick={()=>onStage(company.name,"closed-won")} className="px-2 py-1 text-xs border border-emerald-200 text-emerald-700 rounded-lg hover:bg-emerald-50">Won</button>
                <button onClick={()=>onStage(company.name,"closed-lost")} className="px-2 py-1 text-xs border border-red-200 text-red-600 rounded-lg hover:bg-red-50">Lost</button>
                <button onClick={()=>onStage(company.name,"closed-invalid")} className="px-2 py-1 text-xs border border-amber-200 text-amber-600 rounded-lg hover:bg-amber-50">Invalid</button>
              </>}
              {CLOSED_STAGES.includes(stage)&&<button onClick={()=>onStage(company.name,"new")} className="px-2 py-1 text-xs border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-50">Re-open</button>}
            </div>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-fit mb-5">
        {TABS.map(([t,l])=>(
          <button key={t} onClick={()=>setTab(t)} className={`px-5 py-2 rounded-lg text-xs font-semibold transition-all ${tab===t?"bg-white text-slate-800 shadow-sm":"text-slate-500 hover:text-slate-700"}`}>{l}</button>
        ))}
      </div>

      {/* Tab content */}
      {tab==="overview"&&(
        <div className="space-y-4">
          {/* Fit reason */}
          {company.fitReason&&<div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Why Evolve should call</h3>
            <p className="text-sm text-slate-700">{company.fitReason}</p>
          </div>}
          {/* Source + stage info */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Lead info</h3>
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div><span className="text-slate-400 block mb-1">Source</span><span className="font-medium text-slate-700">{company.source?`${company.source.channel} - ${company.source.method}`:company.searchMode?"Discover - "+company.searchMode:"Discover"}</span></div>
              <div><span className="text-slate-400 block mb-1">Stage</span><StageBadge stage={stage}/></div>
              <div><span className="text-slate-400 block mb-1">Owner</span><span className="font-medium text-slate-700">{company.ownerName||"—"}</span></div>
              {company.source?.label&&<div><span className="text-slate-400 block mb-1">Search</span><span className="font-medium text-slate-700">{company.source.label}</span></div>}
            </div>
          </div>
          {/* Activity log */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <LogPanel log={company.activityLog||[]} isOwner={true} isAdmin={true}/>
            {(!company.activityLog||!company.activityLog.length)&&<p className="text-xs text-slate-400 text-center py-4">No activity yet.</p>}
          </div>
        </div>
      )}
      {tab==="enrich"&&(
        <Enrich company={company} idx={idx} onBack={()=>setTab("overview")} onOutreach={()=>setTab("outreach")} onSave={onSave} isSaved={isSaved} cu={cu} settings={settings} onLogAct={onLogAct}/>
      )}
      {tab==="outreach"&&(
        <Outreach company={company} onBack={()=>setTab("overview")} onSave={onSave} isSaved={isSaved} cu={cu} onLogAct={onLogAct} settings={settings}/>
      )}
    </div>
  );
}

function SourceBadge({source,lead}){
  // Build source from legacy lead fields if source object missing
  const resolved=source||(()=>{
    if(!lead)return null;
    const method=lead.searchMode==="niche"?"Niche":lead.searchMode==="industry"?"Industry":lead.searchMode||"AI Only";
    return {channel:"Discover",method,label:lead.searchLabel||lead.industry||""};
  })();
  if(!resolved)return <span className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full font-medium bg-slate-100 text-slate-500">Discover</span>;
  const colors={"AI Only":"bg-violet-50 text-violet-700","AI + Web":"bg-blue-50 text-blue-700","Apollo":"bg-cyan-50 text-cyan-700","SerpAPI":"bg-amber-50 text-amber-700","Niche":"bg-indigo-50 text-indigo-700","Industry":"bg-slate-100 text-slate-600","CSV":"bg-emerald-50 text-emerald-700","Manual Entry":"bg-slate-100 text-slate-600"};
  const tip=`${resolved.channel} - ${resolved.method}${resolved.label?" - "+resolved.label:""}`;
  return(
    <span className={`inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full font-medium ${colors[resolved.method]||"bg-slate-100 text-slate-500"}`} title={tip}>
      {resolved.method||resolved.channel}
    </span>
  );
}

function StageBadge({stage}){
  const m={
    new:"bg-slate-100 text-slate-600",
    progress:"bg-blue-100 text-blue-700",
    "closed-won":"bg-emerald-100 text-emerald-700",
    "closed-lost":"bg-red-100 text-red-600",
    "closed-invalid":"bg-amber-100 text-amber-700",
  };
  const l={new:"New",progress:"In Progress","closed-won":"Closed Won","closed-lost":"Closed Lost","closed-invalid":"Invalid"};
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${m[stage]||m.new}`}>{l[stage]||"New"}</span>;
}

function Saved({leads,onSave,onEnrich,onOutreach,cu,onStage,settings}){
  const isAdmin=cu.role==="admin";
  const visible=isAdmin?leads:leads.filter(l=>l.ownerId===cu.username);
  const [stageTab,setStageTab]=useState("new");
  const [ownerFilter,setOwnerFilter]=useState("all");
  const staged=visible.filter(l=>(l.stage||"new")===stageTab);
  const filtered=ownerFilter==="all"?staged:staged.filter(l=>l.ownerId===ownerFilter);
  const owners=[...new Set(leads.map(l=>l.ownerId))];
  const CLOSED_STAGES=["closed-won","closed-lost","closed-invalid"];
  const counts={
    new:visible.filter(l=>!l.stage||l.stage==="new").length,
    progress:visible.filter(l=>l.stage==="progress").length,
    "closed-won":visible.filter(l=>l.stage==="closed-won").length,
    "closed-lost":visible.filter(l=>l.stage==="closed-lost").length,
    "closed-invalid":visible.filter(l=>l.stage==="closed-invalid").length,
  };
  const totalClosed=CLOSED_STAGES.reduce((a,s)=>a+(counts[s]||0),0);
  return(
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-4">
        <div><h1 className="text-xl font-semibold text-slate-800">{isAdmin?"All leads":"My leads"}</h1><p className="text-sm text-slate-500">{visible.length} total · {counts.new} new · {counts.progress} in progress · {totalClosed} closed</p></div>
        {isAdmin&&owners.length>1&&<select value={ownerFilter} onChange={e=>setOwnerFilter(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none"><option value="all">All users</option>{owners.map(o=><option key={o} value={o}>{o}</option>)}</select>}
      </div>
      {/* Stage tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-fit mb-5">
        {[["new","New"],["progress","In Progress"],["closed-won","Won"],["closed-lost","Lost"],["closed-invalid","Invalid"]].map(([s,l])=>(
          <button key={s} onClick={()=>setStageTab(s)} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${stageTab===s?"bg-white text-slate-800 shadow-sm":"text-slate-500 hover:text-slate-700"}`}>
            {l}<span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs font-bold ${stageTab===s?"bg-slate-100 text-slate-600":"bg-slate-200 text-slate-400"}`}>{counts[s]||0}</span>
          </button>
        ))}
      </div>
      {filtered.length===0?<div className="bg-white rounded-2xl border border-slate-200 p-12 text-center"><Bookmark size={32} className="text-slate-300 mx-auto mb-3"/><div className="text-slate-500 text-sm">No leads here yet.</div></div>:(
        <div className="flex flex-col gap-3">
          {filtered.map((c,i)=>(
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 cursor-pointer hover:border-slate-300 hover:shadow-sm transition-all" onClick={()=>onEnrich(c,i)}>
              <div className="flex items-center gap-3">
                <Av name={c.name} idx={i}/>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap"><span className="font-semibold text-slate-800 text-sm">{c.name}</span><Score s={c.fitScore}/><StageBadge stage={c.stage}/><SourceBadge source={c.source} lead={c}/>{isAdmin&&c.ownerName&&<span className="flex items-center gap-1 text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full"><User size={10}/>{c.ownerName}</span>}</div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-slate-500">{c.industry} · {c.location}</span>
                    {c.website&&<a href={`https://${c.website}`} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"><Globe size={10}/>{c.website}</a>}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5 truncate">{c.signal}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={e=>{e.stopPropagation();onEnrich(c,i);}} className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 text-white rounded-lg text-xs font-medium hover:bg-violet-700"><TrendingUp size={12}/>Open</button>
                  <div className="flex gap-1">
                    {(c.stage||"new")!=="progress"&&<button onClick={e=>{e.stopPropagation();onStage(c.name,"progress");}} className="px-2 py-1.5 text-xs border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50" title="Move to In Progress">→ Progress</button>}
                    {!["closed-won","closed-lost","closed-invalid"].includes(c.stage)&&<>
                      <button onClick={e=>{e.stopPropagation();onStage(c.name,"closed-won");}} className="px-2 py-1.5 text-xs border border-emerald-200 text-emerald-700 rounded-lg hover:bg-emerald-50" title="Closed Won">Won</button>
                      <button onClick={e=>{e.stopPropagation();onStage(c.name,"closed-lost");}} className="px-2 py-1.5 text-xs border border-red-200 text-red-600 rounded-lg hover:bg-red-50" title="Closed Lost">Lost</button>
                      <button onClick={e=>{e.stopPropagation();onStage(c.name,"closed-invalid");}} className="px-2 py-1.5 text-xs border border-amber-200 text-amber-600 rounded-lg hover:bg-amber-50" title="Invalid">Invalid</button>
                    </>}
                    {["closed-won","closed-lost","closed-invalid"].includes(c.stage)&&<button onClick={e=>{e.stopPropagation();onStage(c.name,"new");}} className="px-2 py-1.5 text-xs border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-50" title="Re-open">Re-open</button>}
                  </div>
                  <button onClick={()=>onSave(c)} className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-slate-500 rounded-lg text-xs hover:border-red-200 hover:text-red-500"><Trash2 size={12}/>Remove</button>
                </div>
              </div>
              <LogPanel log={c.activityLog||[]} isOwner={cu.username===c.ownerId} isAdmin={isAdmin}/>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ══ ENRICH ══
function Enrich({company,idx,onBack,onOutreach,onSave,isSaved,cu,settings,onLogAct=()=>{}}){
  const [loading,setLoading]=useState(false);const [data,setData]=useState(null);const [err,setErr]=useState("");const [cached,setCached]=useState(false);
  const MAX_CONTACTS=10;
  const [showAddContact,setShowAddContact]=useState(false);
  const [newContact,setNewContact]=useState({name:"",title:"",email:"",phone:""});
  const [addContactErr,setAddContactErr]=useState("");
  const [editIdx,setEditIdx]=useState(null); // index of contact being edited
  const [editContact,setEditContact]=useState({name:"",title:"",email:"",phone:"",linkedin:""});

  function saveToCache(updated){
    setData(updated);
    ss(`enr_${slug}`,updated);
    if(sbUrl&&sbKey){sbSaveEnrichment(sbUrl,sbKey,slug,company.name,updated);sbSaveContacts(sbUrl,sbKey,company.name,updated.keyContacts);}
  }

  function addContactManually(){
    if(!newContact.name.trim()){setAddContactErr("Name is required.");return;}
    const current=data?.keyContacts||[];
    if(current.length>=MAX_CONTACTS){setAddContactErr(`Max ${MAX_CONTACTS} contacts per lead.`);return;}
    const contact={
      name:newContact.name.trim(),
      title:newContact.title.trim(),
      email:newContact.email.trim()||null,
      emailType:newContact.email.trim()?"Work":null,
      phone:newContact.phone.trim()||null,
      phoneType:newContact.phone.trim()?"Direct":null,
      linkedin:newContact.linkedin?.trim()||null,
      source:"Manual",
    };
    saveToCache({...(data||{}),keyContacts:[...current,contact]});
    setNewContact({name:"",title:"",email:"",phone:"",linkedin:""});
    setAddContactErr("");setShowAddContact(false);
  }

  function startEdit(idx){
    const ct=data.keyContacts[idx];
    setEditContact({name:ct.name||"",title:ct.title||"",email:ct.email||"",phone:ct.phone||"",linkedin:ct.linkedin||""});
    setEditIdx(idx);setShowAddContact(false);
  }

  function saveEdit(){
    if(!editContact.name.trim()){return;}
    const updated={...data,keyContacts:data.keyContacts.map((ct,i)=>i===editIdx?{
      ...ct,
      name:editContact.name.trim(),
      title:editContact.title.trim(),
      email:editContact.email.trim()||null,
      emailType:editContact.email.trim()?"Work":ct.emailType,
      phone:editContact.phone.trim()||null,
      phoneType:editContact.phone.trim()?ct.phoneType||"Direct":null,
      linkedin:editContact.linkedin.trim()||null,
    }:ct)};
    saveToCache(updated);
    setEditIdx(null);
  }

  function removeContact(idx){
    saveToCache({...data,keyContacts:data.keyContacts.filter((_,i)=>i!==idx)});
  }
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
    const prompt=`Business intelligence for Evolve ESolutions (IT/HR/Healthcare/Legal/Financial Services recruitment). Research ${company.name} (website: ${company.website||"unknown"}, industry: ${company.industry||"unknown"}, location: ${company.location||"unknown"}).

CONTACT RULES (strictly follow):
1. Only include email if found from a real source (website, press release, LinkedIn). Never guess or construct emails.
2. If email unknown, set null. Never invent firstname@company.com patterns.
3. Same for phone - real source only, null if unknown.
4. Email type: "Work" or "Personal". Null if no email.
5. Phone type: "Direct", "Mobile", "Office", or "HQ". Null if no phone.

JOB POSTINGS: Search ${company.website||company.name} careers page and their LinkedIn company page for active job postings from the last 3 months. List up to 6 real roles currently being hired.

COMPANY LINKEDIN: Find their official LinkedIn company page URL (format: linkedin.com/company/name).

Return ONLY valid JSON, no markdown:
{"description":"2-sentence overview","founded":"year or null","headcount":"employee count estimate","revenue":"ARR/revenue estimate or Private","funding":"latest round + amount or Bootstrapped","companyLinkedin":"linkedin.com/company/name or null","recentNews":["up to 3 recent news items with month+year"],"techStack":["3-5 key technologies they use"],"recentJobs":[{"title":"Job Title","department":"Engineering/Sales/etc","postedDate":"Month YYYY or Recent"},{"title":"Job Title","department":"","postedDate":""}],"hiringRoles":["3-4 broad hiring areas based on job postings"],"keyContacts":[{"name":"","title":"","email":null,"emailType":null,"phone":null,"phoneType":null,"linkedin":"","source":"AI","emailVerified":false},{"name":"","title":"","email":null,"emailType":null,"phone":null,"phoneType":null,"linkedin":"","source":"AI","emailVerified":false}],"painPoints":["2-3 recruitment pain points for this company"],"approachAngle":"one specific outreach angle for Evolve ESolutions based on their job postings and signals","enrichmentSource":"AI"}`;
    try{const t=await ai(prompt,false);const clean=t.split("```json").join("").split("```").join("").trim();const m=clean.match(/\{[\s\S]*\}/);if(m){const d=JSON.parse(m[0]);setData(d);await ss(`enr_${slug}`,d);if(sbUrl&&sbKey){sbSaveEnrichment(sbUrl,sbKey,slug,company.name,d);sbSaveContacts(sbUrl,sbKey,company.name,d.keyContacts||[]);}onLogAct(company,`AI enriched by ${cu.displayName}`);}else setErr("Parse failed. Try again.");}catch(e){
      const msg=e.message||"";
      const isRateLimit=msg.includes("429")||msg.includes("529")||msg.toLowerCase().includes("rate")||msg.toLowerCase().includes("overload");
      const isCredits=msg.includes("credit")||msg.includes("balance")||msg.includes("quota");
      const isAuth=msg.includes("401")||msg.toLowerCase().includes("invalid")||msg.toLowerCase().includes("auth");
      setErr(
        isCredits?"Anthropic API credits exhausted - add credits at console.anthropic.com/billing. You can still use the Apollo contacts button.":
        isRateLimit?`AI rate limit - try again shortly. You can still use "Apollo contacts" button to fetch contacts now without AI.`:
        isAuth?"Invalid Anthropic API key - check your key in Settings.":
        `Enrichment failed: ${msg}`
      );
    }setLoading(false);
  }
  async function enrichWithApollo(){
    if(!apolloKey){setErr("Add Apollo API key in Settings first.");return;}
    // Apollo can run independently - no AI enrichment required
    setLoading(true);setErr("");setCached(false);
    if(!data) setData({}); // init empty data shell so contacts can be stored
    try{
      // Extract clean domain from website - NO guessing from company name
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
      // apolloFindContacts already returns structured contacts - pass through directly
      // Clean legacy "Not found"/"Unknown" strings from older cache entries
      const apolloContacts=people.map(p=>({
        ...p,
        name:(p.name&&p.name!=="Unknown")?p.name.trim():"",
        email:(p.email&&p.email!=="Not found"&&p.email.includes("@"))?p.email:null,
        phone:(p.phone&&p.phone!=="Not found")?p.phone:null,
        phoneType:(p.phoneType&&p.phoneType!=="Not found")?p.phoneType:null,
      })).filter(p=>p.name&&p.email); // only keep contacts with both name and email
      // Merge: keep existing contacts + add Apollo ones, cap at 5
      const existing=(data?.keyContacts||[]).filter(x=>x.source!=="Apollo");
      const combined=[...existing,...apolloContacts].slice(0,5);
      const merged={
        ...(data&&Object.keys(data).length>0?data:{}),
        keyContacts:combined,
        enrichmentSource:data?.enrichmentSource?"Apollo (contacts over AI)":"Apollo (contacts only)",
      };
      setData(merged);
      await ss(`enr_${slug}`,merged);
      if(sbUrl&&sbKey){
        sbSaveEnrichment(sbUrl,sbKey,slug,company.name,merged);
        sbSaveContacts(sbUrl,sbKey,company.name,apolloContacts);
      }
      onLogAct(company,`Apollo enriched by ${cu.displayName} - ${apolloContacts.length} contact${apolloContacts.length!==1?"s":""}${apolloContacts.filter(c=>c.email).length>0?` · ${apolloContacts.filter(c=>c.email).length} with email`:"" }`);
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
        {company.website?<a href={`https://${company.website}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"><Globe size={11}/>{company.website}</a>:<span className="text-xs text-amber-600 flex items-center gap-1">⚠️ No verified website - Apollo enrichment unavailable</span>}
        </div><div className="flex gap-2"><button onClick={()=>onOutreach(company)} className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700"><Mail size={14}/>Outreach</button><button onClick={()=>onSave(company)} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${isSaved?"bg-slate-800 text-white border-slate-800":"border-slate-200 text-slate-700 hover:border-slate-400"}`}>{isSaved?<><BookmarkCheck size={14}/>Saved</>:<><Bookmark size={14}/>Save</>}</button></div></div>
      {!data&&!loading&&<div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
        {apolloKey&&<div className="mb-4">
          <button onClick={enrichWithApollo} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 mb-2">
            <Users size={14}/>Run Apollo contacts only
          </button>
          <p className="text-xs text-slate-400">Skip AI enrichment and fetch contacts directly from Apollo</p>
        </div>}
        <div className="text-slate-300 text-3xl mb-3">🔍</div>
        <TrendingUp size={36} className="text-slate-300 mx-auto mb-3"/>
        <h2 className="font-semibold text-slate-700 mb-1">Deep company research</h2>
        <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">AI researches the company and surfaces contacts, news, tech stack and a tailored approach angle. Then optionally overlay verified contacts from Apollo.</p>
        <button onClick={enrich} className="px-6 py-3 bg-violet-600 text-white rounded-xl text-sm font-medium hover:bg-violet-700 flex items-center gap-2 mx-auto"><Zap size={15}/>Run AI enrichment</button>
      </div>}
      {loading&&<div className="bg-white rounded-2xl border border-slate-200 p-10 text-center"><Loader2 size={28} className="animate-spin text-violet-500 mx-auto mb-3"/><p className="text-sm text-slate-500 mb-1">Researching {company.name}…</p><p className="text-xs text-slate-400">Classifying contacts - 20–30 seconds.</p></div>}
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
          {apolloKey&&<button onClick={enrichWithApollo} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded-lg border border-blue-200 bg-blue-50"><Users size={11}/>Apollo contacts</button>}
          <button onClick={enrich} className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 px-2 py-1 rounded-lg border border-slate-200 bg-white"><RefreshCw size={11}/>{data?"Re-run AI":"Run AI enrichment"}</button>
        </div>
      </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5"><h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Overview</h3><p className="text-sm text-slate-700 leading-relaxed mb-4">{data.description}</p><div className="grid grid-cols-4 gap-3">{[["Founded",data.founded],["Headcount",data.headcount],["Revenue",data.revenue],["Funding",data.funding]].map(([l,v])=><div key={l} className="bg-slate-50 rounded-xl p-3"><div className="text-xs text-slate-400 mb-1">{l}</div><div className="text-sm font-semibold text-slate-800">{v||"—"}</div></div>)}</div></div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1.5"><Users size={13}/>Key contacts</h3>
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${(data.keyContacts||[]).length>=MAX_CONTACTS?"bg-amber-100 text-amber-700":"bg-slate-100 text-slate-500"}`}>{(data.keyContacts||[]).length}/{MAX_CONTACTS}</span>
            </div>
            <div className="flex items-center gap-2">
              {(data.keyContacts||[]).length<MAX_CONTACTS&&<button onClick={()=>{setShowAddContact(p=>!p);setAddContactErr("");}} className="flex items-center gap-1 text-xs text-slate-600 px-2 py-1 rounded-lg border border-slate-200 hover:border-slate-400"><UserPlus size={11}/>{showAddContact?"Cancel":"Add contact"}</button>}
              <div className="flex gap-1">{["Work","Personal","Direct","Mobile"].map(l=><CtBadge key={l} label={l}/>)}</div>
            </div>
          </div>

          {/* Manual add contact form */}
          {showAddContact&&<div className="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-xs font-semibold text-slate-600 mb-3 flex items-center gap-1.5"><UserPlus size={11}/>Add contact manually</p>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div><label className="block text-xs text-slate-500 mb-1">Name *</label><input value={newContact.name} onChange={e=>setNewContact(p=>({...p,name:e.target.value}))} placeholder="Jane Smith" className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-slate-400"/></div>
              <div><label className="block text-xs text-slate-500 mb-1">Title</label><input value={newContact.title} onChange={e=>setNewContact(p=>({...p,title:e.target.value}))} placeholder="CEO" className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-slate-400"/></div>
              <div><label className="block text-xs text-slate-500 mb-1">Email</label><input value={newContact.email} onChange={e=>setNewContact(p=>({...p,email:e.target.value}))} placeholder="jane@company.com" className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-slate-400"/></div>
              <div><label className="block text-xs text-slate-500 mb-1">Phone</label><input value={newContact.phone} onChange={e=>setNewContact(p=>({...p,phone:e.target.value}))} placeholder="+1 925 xxx xxxx" className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-slate-400"/></div>
              <div className="col-span-2"><label className="block text-xs text-slate-500 mb-1">LinkedIn URL</label><input value={newContact.linkedin||""} onChange={e=>setNewContact(p=>({...p,linkedin:e.target.value}))} placeholder="https://linkedin.com/in/jane-smith" className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-slate-400"/></div>
            </div>
            {addContactErr&&<p className="text-xs text-red-500 mb-2">{addContactErr}</p>}
            <button onClick={addContactManually} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-white text-xs rounded-lg hover:bg-slate-700"><UserPlus size={11}/>Add contact</button>
          </div>}

          <div className="grid grid-cols-2 gap-3">
            {(data.keyContacts||[]).map((ct,i)=>(
              <div key={i} className="relative group">
                {editIdx===i?(
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                    <p className="text-xs font-semibold text-blue-700 mb-2 flex items-center gap-1"><Pencil size={10}/>Edit contact</p>
                    <div className="space-y-1.5 mb-2">
                      {[["Name","name","Jane Smith"],["Title","title","CEO"],["Email","email","jane@co.com"],["Phone","phone","+1 925 xxx"],["LinkedIn","linkedin","linkedin.com/in/..."]].map(([lbl,key,ph])=>(
                        <div key={key}><label className="block text-xs text-slate-500 mb-0.5">{lbl}</label><input value={editContact[key]||""} onChange={e=>setEditContact(p=>({...p,[key]:e.target.value}))} placeholder={ph} className="w-full px-2 py-1 text-xs rounded border border-blue-200 focus:outline-none focus:border-blue-400 bg-white"/></div>
                      ))}
                    </div>
                    <div className="flex gap-1.5">
                      <button onClick={saveEdit} className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 text-white text-xs rounded-lg hover:bg-slate-700"><Check size={10}/>Save</button>
                      <button onClick={()=>setEditIdx(null)} className="px-2.5 py-1 text-xs border border-slate-200 rounded-lg text-slate-500 hover:border-slate-400">Cancel</button>
                      <button onClick={()=>{removeContact(i);setEditIdx(null);}} className="ml-auto px-2.5 py-1 text-xs border border-red-200 rounded-lg text-red-400 hover:text-red-600">Remove</button>
                    </div>
                  </div>
                ):(
                  <>
                    <CC c={ct} i={i}/>
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={()=>startEdit(i)} className="w-5 h-5 flex items-center justify-center rounded bg-blue-50 border border-blue-200 text-blue-500 hover:text-blue-700" title="Edit contact"><Pencil size={9}/></button>
                      <button onClick={()=>removeContact(i)} className="w-5 h-5 flex items-center justify-center rounded bg-red-50 border border-red-200 text-red-400 hover:text-red-600" title="Remove contact"><X size={9}/></button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          {(data.keyContacts||[]).length===0&&<p className="text-xs text-slate-400 text-center py-4">No contacts yet - run enrichment or add manually above.</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5"><h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-1.5"><BarChart2 size={13}/>Recent news</h3><ul className="space-y-2">{(data.recentNews||[]).map((n,i)=><li key={i} className="flex items-start gap-2 text-sm text-slate-700"><span className="w-4 h-4 rounded-full bg-violet-100 text-violet-700 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">{i+1}</span>{n}</li>)}</ul></div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            {/* Company LinkedIn */}
            {data.companyLinkedin&&<div className="mb-4 pb-4 border-b border-slate-100"><h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1.5"><Linkedin size={13}/>Company LinkedIn</h3><a href={`https://${data.companyLinkedin.replace("https://","").replace("http://","")}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline"><Globe size={11}/>{data.companyLinkedin}</a></div>}
            {/* Recent job postings */}
            {(data.recentJobs||[]).length>0&&<div className="mb-4 pb-4 border-b border-slate-100">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-1.5"><Briefcase size={13}/>Active job postings <span className="text-slate-300 font-normal normal-case">(last 3 months)</span></h3>
              <div className="space-y-2">
                {(data.recentJobs||[]).map((j,i)=>(
                  <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                    <div><span className="text-sm font-medium text-slate-800">{j.title}</span>{j.department&&<span className="ml-2 text-xs text-slate-400">{j.department}</span>}</div>
                    {j.postedDate&&<span className="text-xs text-slate-400 flex-shrink-0 ml-2">{j.postedDate}</span>}
                  </div>
                ))}
              </div>
            </div>}
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-1.5"><Users size={13}/>Hiring areas</h3>
            <div className="flex flex-wrap gap-2 mb-4">{(data.hiringRoles||[]).map((r,i)=><Pill key={i} label={r} color="bg-emerald-50 text-emerald-700"/>)}</div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1.5"><Globe size={13}/>Tech stack</h3>
            <div className="flex flex-wrap gap-2">{(data.techStack||[]).map((t,i)=><Pill key={i} label={t} color="bg-slate-100 text-slate-600"/>)}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5"><h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-1.5"><AlertCircle size={13}/>Pain points</h3><ul className="space-y-2">{(data.painPoints||[]).map((p,i)=><li key={i} className="flex items-start gap-2 text-sm text-slate-700"><span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 flex-shrink-0"/>{p}</li>)}</ul></div>
          <div className="bg-violet-50 border border-violet-100 rounded-2xl p-5"><h3 className="text-xs font-semibold text-violet-400 uppercase tracking-wide mb-3 flex items-center gap-1.5"><Target size={13}/>Recommended approach</h3><p className="text-sm text-violet-900 leading-relaxed font-medium">{data.approachAngle}</p></div>
        </div>
      </div>}
    </div>
  );
}

// ── Small component: shows how many contacts will be pushed ──
function ContactPreview({company,settings}){
  const [preview,setPreview]=useState(null);
  useEffect(()=>{
    async function load(){
      const slug=company.name.toLowerCase().replace(/\s+/g,"_");
      let enr=await sg(`enr_${slug}`);
      if((!enr?.keyContacts?.length)&&settings?.supabaseUrl&&settings?.supabaseKey){
        enr=await sbLoadEnrichment(settings.supabaseUrl,settings.supabaseKey,slug);
      }
      const all=(enr?.keyContacts||[]);
      const valid=all.filter(c=>c.email&&c.email!=="Not found"&&c.email.includes("@"));
      setPreview({total:all.length,valid:valid.length,emails:valid.map(c=>c.email)});
    }
    load();
  },[company.name]);
  if(!preview)return null;
  if(preview.total===0)return(
    <p className="text-xs text-amber-600 mt-1">⚠️ No contacts found - run Enrich first to get contact emails</p>
  );
  return(
    <div className="mt-1">
      {preview.valid>0
        ?<p className="text-xs text-emerald-600">✓ {preview.valid} contact{preview.valid!==1?"s":""} with email ready to push{preview.valid<preview.total?` (${preview.total-preview.valid} skipped, no email)`:""}</p>
        :<p className="text-xs text-amber-600">⚠️ {preview.total} contact{preview.total!==1?"s":""} found but none have email addresses - edit contacts in Enrich</p>
      }
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
  const [iPushing,setIPushing]=useState(false);const [iPushed,setIPushed]=useState(false);const [iErr,setIErr]=useState("");const [iSkipped,setISkipped]=useState(0);const [iSent,setISent]=useState(0);const [iResult,setIResult]=useState(null);
  const [replyCampaigns,setReplyCampaigns]=useState([]);const [selectedCampaignId,setSelectedCampaignId]=useState("");const [loadingCampaigns,setLoadingCampaigns]=useState(false);
  const [history,setHistory]=useState([]);
  useEffect(()=>{
    // Load push history from Supabase
    if(settings?.supabaseUrl&&settings?.supabaseKey){
      sbLoadOutreach(settings.supabaseUrl,settings.supabaseKey,company.name)
        .then(rows=>setHistory(rows.filter(r=>r.reply_campaign_id)));
    }
  },[company.name,iPushed]);
  const aRefs=useRef({});
  const replyKey=settings?.replyApiKey||"";
  useEffect(()=>{
    if(!replyKey)return;
    setLoadingCampaigns(true);
    replyGetCampaigns(replyKey).then(list=>{
      setReplyCampaigns(list);
      if(list.length&&!selectedCampaignId){
        // Prefer first campaign with email accounts
        const withAccounts=list.filter(c=>c.emailAccounts?.length>0);
        const first=withAccounts[0]||list[0];
        setSelectedCampaignId(String(first.id));
      }
      setLoadingCampaigns(false);
    });
  },[replyKey]);
  useEffect(()=>{sg(`enr_${company.name.toLowerCase().replace(/\s+/g,"_")}`).then(d=>{if(d?.keyContacts){setLiC(d.keyContacts.filter(c=>c.linkedin&&c.linkedin.length>5));setPhC(d.keyContacts);}});},[company.name]);
  const E=`Evolve ESolutions - IT, HR, Healthcare, Financial Services, Legal recruitment, Pleasanton CA. 24-48hr screened candidates. Passive talent. No placement no fee. 1-3 day onboarding.`;
  const iMap={"Technology / SaaS":"IT/software","Financial Services":"finance/compliance","Healthcare":"healthcare/clinical","Legal":"legal/paralegal","Manufacturing":"engineering/ops","E-commerce / Retail":"tech/ops","Construction":"project management","Professional Services":"professional/admin","Media & Marketing":"creative/marketing","Logistics & Supply Chain":"ops/tech"};
  const spec=iMap[company.industry]||company.industry;
  // Emails use Reply.io merge tags - sender name and signature injected per mailbox
  const placeholderSig="{{accountSignature}}";
  // Map step labels to prompt types
  function getStepPromptType(stepLabel){
    const l=stepLabel.toLowerCase();
    if(l.includes("cold intro")||l.includes("intro"))return "intro";
    if(l.includes("follow-up")||l.includes("followup"))return "followup";
    if(l.includes("case study"))return "casestudy";
    if(l.includes("value add")||l.includes("insight"))return "value";
    if(l.includes("break-up")||l.includes("breakup"))return "breakup";
    if(l.includes("job-specific")||l.includes("job specific"))return "jobhook";
    if(l.includes("referral"))return "referral";
    if(l.includes("linkedin"))return "linkedin";
    if(l.includes("call"))return "callscript";
    return "followup";
  }

  const prompts={
    intro:`Write a cold intro email from Evolve ESolutions to a decision-maker at ${company.name}.\n${E}\nTarget: ${company.name}, ${company.industry}, ${company.size}, ${company.location}. Signal: ${company.signal}. Why: ${company.fitReason}\nHook on their signal. One sentence on Evolve. 24-48hr passive talent pitch. Specific day CTA. Under 120 words. Professional, human tone.\nSubject: [under 8 words, no Introducing]\n\nHi {{firstName}},\n\n[email body]\n\n${placeholderSig}`,
    followup:`Write a follow-up email from Evolve ESolutions to ${company.name} - no reply received.\n${E}\nSignal: ${company.signal}. Lead with different value angle (no-fee model). Mention recent ${spec} placements. Soft CTA. Under 80 words.\nSubject: [subject]\n\nHi {{firstName}},\n\n[email body]\n\n${placeholderSig}`,
    casestudy:`Write a case study email from Evolve ESolutions to ${company.name}.\n${E}\nSignal: ${company.signal}. Include a mini case study: similar ${spec} company, specific role, 24-48hr result. Connect to ${company.name}. Under 110 words. CTA: share more?\nSubject: [subject]\n\nHi {{firstName}},\n\n[email body]\n\n${placeholderSig}`,
    value:`Write a value-add email from Evolve ESolutions to ${company.name} - no ask.\n${E}\nSignal: ${company.signal}. Share one specific ${spec} hiring trend insight. Position as expert partner. Soft close. Under 100 words.\nSubject: [subject]\n\nHi {{firstName}},\n\n[email body]\n\n${placeholderSig}`,
    breakup:`Write a break-up email from Evolve ESolutions to ${company.name}. One-sided acknowledgement. Leave door open. One final value line. Under 70 words. Best break-up emails always get replies.\nSubject: [subject]\n\nHi {{firstName}},\n\n[email body]\n\n${placeholderSig}`,
    jobhook:`Write an email from Evolve ESolutions to ${company.name} using their active job postings as the hook.\n${E}\nSignal: ${company.signal}. Reference a specific role they are hiring for. Show how Evolve delivers passive candidates for exactly this role faster than a job board. Under 110 words.\nSubject: [subject referencing their open role]\n\nHi {{firstName}},\n\n[email body]\n\n${placeholderSig}`,
    referral:`Write a referral-ask email from Evolve ESolutions to ${company.name}. They have not engaged yet. Ask if they know anyone in their network who might benefit from Evolve's recruitment support. Humble, brief, no pressure. Under 70 words.\nSubject: [subject]\n\nHi {{firstName}},\n\n[email body]\n\n${placeholderSig}`,
    linkedin:`Write a LinkedIn connection request note from Evolve ESolutions to a contact at ${company.name}. Context: ${company.signal}. Max 300 characters. Warm, peer-to-peer, specific hook, no cliches. Return ONLY the note text, no subject line.`,
    callscript:`Write a cold call script for Evolve ESolutions calling ${company.name}. ${E}\nSignal: ${company.signal}. Spec: ${spec}. Natural, confident, ready for objections.\n[OPENING - 20 words max]\n[IF ENGAGED - value prop]\n[OBJECTION: PSL - handle politely]\n[CLOSE - specific ask]\n200-250 words total.`,
  };
  async function generateAll(){
    // Generate all steps sequentially (email, linkedin, call)
    const allSteps=tmpl.steps;
    setLoading(true);setIErr("");
    for(const s of allSteps){
      if(generatedSteps[s.label])continue; // skip already generated
      const t=getStepPromptType(s.label);
      setStep(s);setEType(t);setContent("Generating...");
      try{
        const txt=await ai(prompts[t]||prompts.intro,false,600);
        setContent(txt);
        const lines=txt.split("\n");
        const subLine=lines.find(l=>l.toLowerCase().startsWith("subject:"))||"Subject: Quick follow-up";
        const subj=subLine.replace(/^subject:\s*/i,"").trim();
        const body=lines.slice(lines.indexOf(subLine)+2).join("\n").trim();
        setGeneratedSteps(prev=>{
          const next={...prev,[s.label]:{subject:subj,body,day:s.day,label:s.label}};
          try{localStorage.setItem(outreachCacheKey,JSON.stringify(next));}catch{}
          return next;
        });
      }catch(e){setContent(`Error: ${e.message}`);break;}
    }
    setLoading(false);
  }

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
      // Store in generatedSteps map so Push to Reply.io can use without re-generating
      setGeneratedSteps(prev=>{
        const next={...prev,[s.label]:{subject:subj,body,day:s.day,label:s.label}};
        try{localStorage.setItem(outreachCacheKey,JSON.stringify(next));}catch{}
        return next;
      });
      onLogAct(company,"outreach generated");
      // Save to DB
      if(settings?.supabaseUrl&&settings?.supabaseKey){
        sbSaveOutreach(settings.supabaseUrl,settings.supabaseKey,company.name,cu.username,cu.displayName,tmpl.id,[{day:s.day,label:s.label,subject:subj,body}]);
      }
    }catch(e){setContent(`Error: ${e.message||"Check API key in Settings."}`);}
    setLoading(false);
  }

  async function pushToReply(){
    if(!replyKey){setIErr("Add Reply.io API key in Settings first.");return;}
    // Warn if selected campaign has no email accounts
    const selCampaign=replyCampaigns.find(c=>String(c.id)===String(selectedCampaignId));
    if(selCampaign&&(!selCampaign.emailAccounts||selCampaign.emailAccounts.length===0)){
      setIErr(`Campaign "${selCampaign.name}" has no email accounts connected. Go to Reply.io → this campaign → Settings → Email Accounts to connect one.`);
      return;
    }
    // Use already-generated steps - no re-generation needed (avoids rate limit)
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
      // Load enrichment - try localStorage first, fall back to Supabase
      let enriched=await sg(`enr_${company.name.toLowerCase().replace(/\s+/g,"_")}`);
      if((!enriched?.keyContacts?.length)&&settings?.supabaseUrl&&settings?.supabaseKey){
        const slug=company.name.toLowerCase().replace(/\s+/g,"_");
        const sbData=await sbLoadEnrichment(settings.supabaseUrl,settings.supabaseKey,slug);
        if(sbData?.keyContacts?.length){enriched=sbData;ss(`enr_${slug}`,sbData);} // cache locally too
      }
      const allContacts=(enriched?.keyContacts||[]).map(ct=>({...ct,company:company.name}));
      // Clean legacy "Not found" strings and filter to valid emails only
      const rawContacts=allContacts
        .map(ct=>({...ct,email:(ct.email&&ct.email!=="Not found"&&ct.email.includes("@"))?ct.email:null}))
        .filter(ct=>ct.email);

      // Hunter.io email verification - skip if no key
      let contacts=rawContacts;
      const hunterKey=settings?.hunterKey;
      if(hunterKey&&rawContacts.length){
        setIErr("Verifying emails with Hunter.io…");
        const verified=await Promise.all(rawContacts.map(async ct=>{
          try{
            const r=await fetch("/api/hunter",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:ct.email,apiKey:hunterKey})});
            const d=await r.json();
            // valid or accept_all = keep; invalid = drop; unknown = keep with warning
            // Only drop if CLEARLY invalid - score < 30 AND status invalid
            // accept_all/unknown/valid → always keep
            // invalid with score >= 30 → probably still valid (Hunter can be wrong on corporate domains)
            if(d.status==="invalid"&&(d.score||0)<30){return null;}
            return {...ct,hunterStatus:d.status,hunterScore:d.score};
          }catch{return ct;} // if Hunter fails, keep contact anyway
        }));
        contacts=verified.filter(Boolean);
        const dropped=rawContacts.length-contacts.length;
        if(dropped>0)console.log(`Hunter.io: dropped ${dropped} invalid email(s)`);
        setIErr(""); // clear verification message
      }
      const skipped=allContacts.length-contacts.length;
      setISkipped(skipped);
      setISent(contacts.length);
      if(!contacts.length){
        const reason=allContacts.length===0
          ?"No contacts found - run AI Enrichment or Apollo first to get contact details."
          :`${allContacts.length} contact${allContacts.length!==1?"s":""} found but none have verified email addresses. Edit contacts in Enrich to add emails.`;
        setIErr(reason);setIPushing(false);return;
      }
      const campaignName=`EVL-AI-Client - ${company.name} - ${tmpl.label} - ${new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})}`;
      const pushResult=await replyPushCampaign(replyKey,campaignName,contacts,steps,selectedCampaignId);
      const campaignId=pushResult.campaignId||pushResult;
      if(pushResult.addResult)setIResult(pushResult.addResult);
      onLogAct(company,`pushed to Reply.io - ${tmpl.label} - ${contacts.length} contact${contacts.length!==1?"s":""} - ID: ${campaignId}`);
      setIPushed(campaignId);
      // Save full sequence to DB
      if(settings?.supabaseUrl&&settings?.supabaseKey){
        sbSaveOutreach(settings.supabaseUrl,settings.supabaseKey,company.name,cu.username,cu.displayName,tmpl.id,steps,campaignId,contacts.length);
      }
    }catch(e){setIErr(`Reply.io push failed: ${e.message}`);}
    setIPushing(false);
  }
  async function genLi(c,i){setLiLoad(p=>({...p,[i]:true}));const t=await ai(`LinkedIn connection note from Evolve ESolutions to ${c.name}, ${c.title} at ${company.name}. Context: ${company.signal}. Max 300 chars. Warm, peer-to-peer, specific hook, no cliches. Return ONLY note text.`).catch(()=>"Error.");setLiMsg(p=>({...p,[i]:t.trim()}));setLiLoad(p=>({...p,[i]:false}));}
  async function genScript(c,i){setLScript(p=>({...p,[i]:true}));const t=await ai(`Cold call script for ${c.name}, ${c.title} at ${company.name}. Evolve ESolutions - IT/HR/Healthcare recruitment, 24-48hr, passive talent, no-fee. Signal: ${company.signal}. Natural, confident. [OPENING][IF ENGAGE][OBJECTION: PSL][CLOSE]. 200-280 words.`).catch(()=>"Error.");setScripts(p=>({...p,[i]:t}));setPhTab(p=>({...p,[i]:"script"}));setLScript(p=>({...p,[i]:false}));}
  async function genText(c,i){setLText(p=>({...p,[i]:true}));const t=await ai(`SMS follow-up from Evolve ESolutions to ${c.name} at ${company.name} after missed call. Context: ${company.signal}. Max 160 chars. Human not marketing. Identify yourself. One value hook. Light CTA. Return ONLY SMS text.`).catch(()=>"Error.");setTexts(p=>({...p,[i]:t.trim()}));setPhTab(p=>({...p,[i]:"text"}));setLText(p=>({...p,[i]:false}));}
  async function genVoice(c,i){
    const s=await sg(S_SETTINGS);
    const key=s?.elevenLabsKey;
    if(!key){alert("Add ElevenLabs API key in Settings → API Keys tab.");return;}
    setLVoice(p=>({...p,[i]:true}));
    try{
      // Auto-generate script if none yet
      let script=scripts[i];
      if(!script){
        script=await ai(`Cold call script for ${c.name}, ${c.title} at ${company.name}. Evolve ESolutions - IT/HR/Healthcare recruitment, 24-48hr, passive talent, no-fee. Signal: ${company.signal}. Natural, confident. [OPENING][IF ENGAGE][OBJECTION: PSL][CLOSE]. 200-280 words.`).catch(()=>"");
        if(script)setScripts(p=>({...p,[i]:script}));
      }
      if(!script){alert("Could not generate script. Try again.");setLVoice(p=>({...p,[i]:false}));return;}
      const blob=await tts(script.replace(/\[.*?\]/g,""),key,s.elevenLabsVoiceId);
      const url=URL.createObjectURL(blob);
      setAudios(p=>({...p,[i]:url}));
      setPhTab(p=>({...p,[i]:"voice"}));
    }catch(e){alert(`Voice error: ${e.message}`);}
    setLVoice(p=>({...p,[i]:false}));
  }
  function togPlay(i){const a=aRefs.current[i];if(!a)return;if(playing[i]){a.pause();setPlaying(p=>({...p,[i]:false}));}else{a.play();setPlaying(p=>({...p,[i]:true}));a.onended=()=>setPlaying(p=>({...p,[i]:false}));}}
  function copy(v,k){navigator.clipboard.writeText(v);setPhCp(k);setTimeout(()=>setPhCp(""),2000);}

  return(
    <div className="max-w-4xl mx-auto px-6 py-8">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-5"><ArrowLeft size={14}/>Back</button>
      <div className="flex items-start gap-3 mb-5"><Av name={company.name} idx={0} lg/><div className="flex-1"><h1 className="text-xl font-semibold text-slate-800">{company.name}</h1>
          <p className="text-sm text-slate-500">{company.industry} · {company.location}</p>
          {company.website&&<a href={`https://${company.website}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"><Globe size={11}/>{company.website}</a>}
          </div><button onClick={()=>onSave(company)} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${isSaved?"bg-slate-800 text-white border-slate-800":"border-slate-200 text-slate-700 hover:border-slate-400"}`}>{isSaved?<><BookmarkCheck size={14}/>Saved</>:<><Bookmark size={14}/>Save</>}</button></div>

      <ReplyTags user={cu}/>

      {/* Reply.io campaign push */}
      {replyKey&&<div className="bg-white rounded-xl border border-slate-200 px-4 py-3 mb-3">
        <div className="flex items-center gap-3">
          <label className="text-xs font-medium text-slate-500 whitespace-nowrap">Reply.io campaign:</label>
          {loadingCampaigns?<span className="text-xs text-slate-400">Loading campaigns...</span>:
          replyCampaigns.length?<select value={selectedCampaignId} onChange={e=>setSelectedCampaignId(e.target.value)} className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:border-slate-400">
            {replyCampaigns.map(camp=><option key={camp.id} value={String(camp.id)}>{camp.name}{camp.emailAccounts?.length?"":" (no email accounts)"}</option>)}
          </select>:
          <span className="text-xs text-amber-600">No campaigns found — create one in Reply.io first</span>}
          <button onClick={()=>{setLoadingCampaigns(true);replyGetCampaigns(replyKey).then(list=>{setReplyCampaigns(list);if(list.length)setSelectedCampaignId(String(list[0].id));setLoadingCampaigns(false);});}} className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 border border-slate-200 rounded-lg" title="Refresh campaigns"><RefreshCw size={10}/></button>
        </div>
      </div>}
      <div className={`rounded-xl border px-4 py-3 mb-5 flex items-center justify-between gap-4 ${iPushed?"bg-emerald-50 border-emerald-100":"bg-slate-50 border-slate-200"}`}>
        <div className="flex-1 min-w-0">
          {iPushed?(
            <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0"/><div><p className="text-xs font-semibold text-emerald-700">Campaign created in Reply.io</p><div>
                <p className="text-xs text-emerald-600 font-medium">Campaign created - activate it in Reply.io to start sending.</p>
                <p className="text-xs text-emerald-500 mt-0.5">ID: {iPushed}</p>
                <p className="text-xs text-emerald-500">{iSent} lead{iSent!==1?"s":""} added{iSkipped>0?` - ${iSkipped} skipped (no email)`:""}</p>
              </div></div></div>
          ):(
            <div>
              <p className="text-xs font-semibold text-slate-700">Push full sequence to Reply.io</p>
              <p className="text-xs text-slate-500">{(()=>{const total=tmpl.steps.filter(s=>s.type==="email").length;const ready=Object.keys(generatedSteps).length;return ready>=total?`All ${total} steps ready to push`:`${ready}/${total} steps generated - click each step to generate before pushing`;})()}</p>
              <ContactPreview company={company} settings={settings}/>
            </div>
          )}
          {iErr&&<div className="mt-1">
            <p className="text-xs text-red-600">{iErr}</p>
            {iErr.includes("Unauthorized")&&<p className="text-xs text-amber-700 mt-1 bg-amber-50 border border-amber-100 rounded-lg px-2 py-1">
              ⚠️ Your key is a v1 key. Get your key from Reply.io → Settings → API with scopes: campaigns:all + leads:all → paste new key in Settings.
            </p>}
          </div>}
        </div>
        {replyKey?(
          <button onClick={pushToReply} disabled={iPushing} className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-medium hover:bg-slate-700 disabled:opacity-60 flex-shrink-0 whitespace-nowrap">
            {iPushing?<><Loader2 size={12} className="animate-spin"/>Generating & pushing…</>:iPushed?<><RefreshCw size={12}/>Push again</>:<><Mail size={12}/>Push to Reply.io</>}
          </button>
        ):(
          <span className="text-xs text-slate-400 flex-shrink-0">Add Reply.io key in Settings</span>
        )}
      </div>

      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-2 space-y-4">
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4"><div className="text-xs font-semibold text-indigo-400 uppercase tracking-wide mb-3 flex items-center gap-1.5"><Sparkles size={12}/>Pitch pillars</div><ul className="space-y-2">{[["⚡","24–48hr delivery"],["🎯","Passive talent access"],["🔄","Contract, perm & retained"],["✅","No placement, no fee"],["🚀","1-3 day onboarding"]].map(([icon,text])=><li key={text} className="flex items-center gap-2 text-xs text-indigo-800"><span>{icon}</span><span>{text}</span></li>)}</ul></div>
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Email sequence</h3>
            <div className="flex gap-1.5 mb-2">{SEQ_TEMPLATES.map(t=><button key={t.id} onClick={()=>{setTmpl(t);setGeneratedSteps({});setStep(null);setContent("");}} className={`flex-1 py-2 rounded-xl border text-xs font-medium transition-all ${tmpl.id===t.id?"bg-slate-800 text-white border-slate-800":"border-slate-200 text-slate-600 hover:border-slate-400"}`}>{t.label}</button>)}</div>
            <button onClick={generateAll} disabled={loading} className="w-full flex items-center justify-center gap-1.5 py-2 mb-3 rounded-xl border border-violet-200 bg-violet-50 text-violet-700 text-xs font-medium hover:bg-violet-100 disabled:opacity-50">
              {loading?<><Loader2 size={11} className="animate-spin"/>Generating…</>:<><Sparkles size={11}/>Generate all {tmpl.steps.filter(s=>s.type==="email").length} steps</>}
              {!loading&&Object.keys(generatedSteps).length>0&&<span className="ml-1 text-emerald-600">({Object.keys(generatedSteps).length} done)</span>}
            </button>
            <div className="relative"><div className="absolute left-3.5 top-3 bottom-3 w-px bg-slate-100"/>
              <div className="space-y-2">{tmpl.steps.map((s,i)=><div key={i} className={`relative flex items-center gap-3 p-2.5 rounded-xl cursor-pointer border transition-all ${step?.label===s.label&&step?.day===s.day?"border-emerald-200 bg-emerald-50":"border-transparent hover:border-slate-200 hover:bg-slate-50"}`} onClick={()=>{
                  const eTypeForStep=EMAIL_TYPES.find(e=>s.label.toLowerCase().includes(e[0]))?.[0]||"intro";
                  if(generatedSteps[s.label]){
                    // Already generated - show cached, no API call
                    setStep(s);setEType(eTypeForStep);
                    const gs=generatedSteps[s.label];
                    setContent(`Subject: ${gs.subject}\n\n${gs.body}`);
                  } else {
                    gen(s,eTypeForStep);
                  }
                }}><div className="w-7 h-7 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center z-10 flex-shrink-0"><span className="text-xs font-semibold text-slate-500">{i+1}</span></div><div className="flex-1 min-w-0"><div className="text-xs font-medium text-slate-800">{s.label}</div><div className="text-xs text-slate-400">Day {s.day}</div></div><span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-md font-medium ${s.type==="call"?"bg-amber-100 text-amber-700":s.type==="linkedin"?"bg-blue-100 text-blue-700":"bg-slate-100 text-slate-600"}`}>{s.type==="call"?<Phone size={12}/>:s.type==="linkedin"?<Linkedin size={12}/>:<Mail size={12}/>}{s.type}</span>
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
        <button onClick={()=>setPhOpen(p=>!p)} className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50"><div className="flex items-center gap-2"><Phone size={15} className="text-emerald-600"/><span className="text-sm font-semibold text-slate-800">Phone outreach</span><span className="text-xs text-slate-400 ml-1">· {phC.length} contact{phC.length!==1?"s":""}</span></div><svg className={`text-slate-400 transition-transform ${phOpen?"rotate-180":""}`} width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 5l5 5 5-5"/></svg></button>
        {phOpen&&<div className="px-5 pb-5 border-t border-slate-100"><p className="text-xs text-slate-500 mt-4 mb-4">Call script, <span className="text-indigo-600 font-medium">ElevenLabs voice note</span>, and SMS follow-up. Voice note auto-generates a script if you haven't yet.</p>
          <div className="space-y-5">{phC.map((c,i)=><div key={i} className="border border-slate-100 rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border-b border-slate-100"><div className={`w-9 h-9 rounded-xl flex items-center justify-center font-semibold text-sm flex-shrink-0 ${PALETTES[i%PALETTES.length]}`}>{c.name.split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase()}</div><div className="flex-1"><div className="text-sm font-semibold text-slate-800">{c.name}</div><div className="flex items-center gap-1.5"><span className="text-xs text-slate-500">{c.title}</span>{c.phoneType&&c.phoneType!=="Not found"&&<CtBadge label={c.phoneType}/>}</div></div>{c.phone&&c.phone!=="Not found"?<a href={`tel:${c.phone.replace(/\s/g,"")}`} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700"><Phone size={12}/>{c.phone}</a>:<span className="text-xs text-slate-400 px-3 py-1.5 border border-slate-200 rounded-lg">No phone</span>}</div>
            <div className="p-4">
              <div className="flex gap-2 mb-4 flex-wrap">
                <button onClick={()=>genScript(c,i)} disabled={lScript[i]} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${phTab[i]==="script"?"bg-slate-800 text-white border-slate-800":"border-slate-200 text-slate-600 hover:border-slate-400"}`}>{lScript[i]?<Loader2 size={12} className="animate-spin"/>:<FileText size={12}/>}{lScript[i]?"Writing…":"Call script"}</button>
                <button onClick={()=>genText(c,i)} disabled={lText[i]} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${phTab[i]==="text"?"bg-slate-800 text-white border-slate-800":"border-slate-200 text-slate-600 hover:border-slate-400"}`}>{lText[i]?<Loader2 size={12} className="animate-spin"/>:<Mail size={12}/>}{lText[i]?"Writing…":"SMS"}</button>
                <button onClick={()=>genVoice(c,i)} disabled={lVoice[i]} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${phTab[i]==="voice"?"bg-indigo-600 text-white border-indigo-600":"border-indigo-50 text-indigo-700 border-indigo-200 hover:border-indigo-400"}`}>{lVoice[i]?<Loader2 size={12} className="animate-spin"/>:<Mic size={12}/>}{lVoice[i]?"Generating…":"Voice note"}</button>
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

      {/* Campaign Push History */}
      {history.length>0&&<div className="bg-white rounded-2xl border border-slate-200 mt-4 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
          <Clock size={13} className="text-slate-400"/>
          <span className="text-xs font-semibold text-slate-700">Campaign push history</span>
          <span className="text-xs text-slate-400 ml-auto">{history.length} push{history.length!==1?"es":""}</span>
        </div>
        <div className="divide-y divide-slate-100">
          {history.map((h,i)=>(
            <div key={i} className="px-5 py-3 flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Mail size={11} className="text-emerald-600"/>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-slate-800">{h.owner_name||h.owner_id}</span>
                  <span className="text-xs text-slate-400">pushed</span>
                  <span className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{h.sequence_type}</span>
                  {h.contact_count>0&&<span className="text-xs text-slate-500">{h.contact_count} contact{h.contact_count!==1?"s":""}</span>}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-slate-400">{h.pushed_at?new Date(h.pushed_at).toLocaleString("en-US",{month:"short",day:"numeric",year:"numeric",hour:"2-digit",minute:"2-digit"}):new Date(h.created_at).toLocaleString("en-US",{month:"short",day:"numeric",year:"numeric",hour:"2-digit",minute:"2-digit"})}</span>
                  {h.reply_campaign_id&&<a href={`https://app.reply.io/${h.reply_campaign_id}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"><Globe size={10}/>View in Reply.io</a>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>}

      {/* LinkedIn */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mt-4">
        <button onClick={()=>setLiOpen(p=>!p)} className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50"><div className="flex items-center gap-2"><Linkedin size={15} className="text-blue-600"/><span className="text-sm font-semibold text-slate-800">LinkedIn outreach</span><span className="text-xs text-slate-400 ml-1">· separate from email sequence</span></div><svg className={`text-slate-400 transition-transform ${liOpen?"rotate-180":""}`} width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 5l5 5 5-5"/></svg></button>
        {liOpen&&<div className="px-5 pb-5 border-t border-slate-100"><p className="text-xs text-slate-500 mt-4 mb-4">Connect before Day 1 - a recognised name lifts open rates significantly.</p>
          {liC.length===0&&<div className="text-sm text-slate-400 py-2">Run enrichment first to populate LinkedIn contacts.</div>}
          <div className="space-y-4">{liC.map((c,i)=><div key={i} className="border border-slate-100 rounded-xl p-4 bg-slate-50">
            <div className="flex items-center gap-3 mb-3"><div className={`w-9 h-9 rounded-xl flex items-center justify-center font-semibold text-sm flex-shrink-0 ${PALETTES[i%PALETTES.length]}`}>{c.name.split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase()}</div><div className="flex-1"><div className="text-sm font-semibold text-slate-800">{c.name}</div><div className="text-xs text-slate-500">{c.title}</div></div>{c.linkedin?<a href={`https://${c.linkedin.replace("https://","")}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700"><Linkedin size={12}/>View profile</a>:<a href={`https://linkedin.com/search/results/people/?keywords=${encodeURIComponent(c.name+" "+company.name)}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-slate-500 rounded-lg text-xs font-medium hover:border-slate-400"><Linkedin size={12}/>Search</a>}</div>
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
      let loadedSettings=s||{};
      // Migrate legacy instantlyV2Key → replyApiKey
      if(loadedSettings.instantlyV2Key&&!loadedSettings.replyApiKey){
        loadedSettings={...loadedSettings,replyApiKey:loadedSettings.instantlyV2Key};
        delete loadedSettings.instantlyV2Key;
        ss(S_SETTINGS,loadedSettings);
      }
      // Always inject env var Supabase creds — overrides whatever is in localStorage
      // This means clearing cache never loses the Supabase connection
      if(ENV_SB_URL){
        loadedSettings={...loadedSettings,supabaseUrl:ENV_SB_URL,supabaseKey:ENV_SB_KEY};
        ss(S_SETTINGS,loadedSettings);
      }
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
        // Users + niches + industries from config table
        if(config?.users?.length) setUsers(config.users);
        else setUsers(u||[DEFAULT_ADMIN]);
        if(config?.niches?.length)setDynNiches(config.niches);
        if(config?.industries?.length)setDynIndustries(config.industries);
        // Merge settings: Supabase is source of truth for API keys
        // Supabase wins over localStorage (except supabaseUrl/Key which must stay local)
        if(config?.settings){
          const merged={
            ...loadedSettings,           // local base (has supabaseUrl+Key)
            ...config.settings,          // Supabase overrides all API keys
            supabaseUrl:loadedSettings.supabaseUrl,  // always keep local supabase creds
            supabaseKey:loadedSettings.supabaseKey,
          };
          setSettings(merged);
          await ss(S_SETTINGS,merged);   // sync merged back to localStorage
          if(merged.anthropicKey) _anthropicKey=merged.anthropicKey;
        } else if(Object.keys(loadedSettings).length>2){
          // No Supabase config yet but local settings exist — push them up
          const {supabaseUrl,supabaseKey,...safeSettings}=loadedSettings;
          if(supabaseUrl&&supabaseKey&&Object.keys(safeSettings).some(k=>safeSettings[k]))
            saveConfigToSB(supabaseUrl,supabaseKey,"settings",safeSettings);
        }
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
    // Migrate legacy instantlyV2Key → replyApiKey if present
    if(s.instantlyV2Key&&!s.replyApiKey){
      s={...s,replyApiKey:s.instantlyV2Key};
      delete s.instantlyV2Key;
    }
    setSettings(s);
    await ss(S_SETTINGS,s);
    if(s.anthropicKey) _anthropicKey=s.anthropicKey;
    // Sync settings to Supabase so all users/devices get the same keys
    if(s.supabaseUrl&&s.supabaseKey){
      // Store without supabaseUrl/supabaseKey themselves (avoid circular dependency)
      const {supabaseUrl,supabaseKey,...safeSettings}=s;
      saveConfigToSB(s.supabaseUrl,s.supabaseKey,"settings",safeSettings);
    }
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
        const lead={...company,ownerId:cu.username,ownerName:cu.displayName,activityLog:[],
          stage:company.stage||"new",
          source:company.source||{channel:"Discover",method:"AI Only",label:company.searchLabel||""},
        };
        const withLog=addLog(lead,`saved by ${cu.displayName}`,cu);
        next=[...prev,withLog];
        if(settings.supabaseUrl&&settings.supabaseKey) sbUpsert(settings.supabaseUrl,settings.supabaseKey,"leads",{name:withLog.name,owner_id:withLog.ownerId,owner_name:withLog.ownerName,data:withLog},"name");
      }
      ss(S_LEADS,next);
      return next;
    });
  }
  // Batch save: atomically saves multiple leads at once - avoids stale state bug
  function batchSave(companies){
    setLeads(prev=>{
      let next=[...prev];
      const toSave=[];
      companies.forEach(company=>{
        if(!next.some(l=>l.name===company.name)){
          const lead={...company,ownerId:cu.username,ownerName:cu.displayName,activityLog:[],
            stage:company.stage||"new",
            source:company.source||{channel:"Discover",method:"AI Only",label:""},
          };
          const withLog=addLog(lead,`discovered by ${cu.displayName}`,cu);
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
  function setStage(companyName,stage){setLeads(prev=>{const n=prev.map(l=>{if(l.name!==companyName)return l;const updated={...l,stage};if(settings.supabaseUrl&&settings.supabaseKey)sbUpsert(settings.supabaseUrl,settings.supabaseKey,"leads",{name:updated.name,owner_id:updated.ownerId,owner_name:updated.ownerName,data:updated},"name");return updated;});ss(S_LEADS,n);return n;});}
  function isSaved(name){return leads.some(l=>l.name===name);}
  function goEnrich(c,i){setETarget(c);setEIdx(i||0);setView("enrich");}
  function goCompany(company,i){setETarget(company);setEIdx(i||0);setView("company");}
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

      {view==="discover"&&<Discover leads={leads} onSave={toggleSave} onBatchSave={batchSave} onEnrich={goEnrich} onOutreach={goOutreach} cu={cu} niches={dynNiches} industries={dynIndustries} settings={settings}/>}
      {view==="saved"&&<Saved leads={leads} onSave={toggleSave} onEnrich={goCompany} onOutreach={goOutreach} cu={cu} onStage={setStage} settings={settings}/>}
      {view==="settings"&&isAdmin&&<SettingsView settings={settings} onSave={saveSettings} users={users} onAdd={addUser} onRemove={removeUser} onPwReset={pwReset} cu={cu} niches={dynNiches} industries={dynIndustries} onSaveNiches={saveNiches} onSaveIndustries={saveIndustries}/>}
      {view==="company"&&eTarget&&<CompanyDetail company={eTarget} idx={eIdx} onBack={()=>setView("saved")} onSave={toggleSave} isSaved={isSaved(eTarget.name)} cu={cu} settings={settings} onLogAct={logAct} onStage={setStage}/>}
      {view==="enrich"&&eTarget&&<Enrich company={eTarget} idx={eIdx} onBack={()=>setView("saved")} onOutreach={goOutreach} onSave={toggleSave} isSaved={isSaved(eTarget.name)} cu={cu} settings={settings} onLogAct={logAct}/>}
      {view==="outreach"&&oTarget&&<Outreach company={oTarget} onBack={()=>setView("saved")} onSave={toggleSave} isSaved={isSaved(oTarget.name)} cu={cu} onLogAct={logAct} settings={settings}/>}
    </div>
  );
}
