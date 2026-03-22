"use client";
import { useEffect, useState } from "react";
import type { AdminProject, AdminProjectStats } from "@/server_actions/adminProjectActions";
import { createProject, deleteProject, getAdminProjectStats, updateProject } from "@/server_actions/adminProjectActions";
import { Beaker, BookOpen, CheckCircle, Cpu, Film, FolderOpen, Globe, Trash2, Users } from "lucide-react";
import { AdminPageLayout, PageHeader, FilterBar, TableStateRows, TableActionMenu, AdminPagination, ConfirmDeleteDialog } from "@/components/admin";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

const DOMAIN_ICONS: Record<string, React.ReactNode> = { software: <Cpu size={18} />, film: <Film size={18} />, training: <BookOpen size={18} />, research: <Beaker size={18} />, other: <Globe size={18} /> };
const DOMAIN_LABELS: Record<string,string> = { software:"Software", film:"Film", training:"Training", research:"Research", other:"Other" };
const DOMAIN_OPTIONS = ["software","film","training","research","other"];
const ITEMS_PER_PAGE=10, EMPTY_FORM={name:"",description:"",domain:"software"};

export default function ProjectsPage(){
  const [page,setPage]=useState(1), [domainFilter,setDomainFilter]=useState("all"), [stats,setStats]=useState<AdminProjectStats|null>(null), [loading,setLoading]=useState(true);
  const [viewProject,setViewProject]=useState<AdminProject|null>(null), [editProject,setEditProject]=useState<AdminProject|null>(null), [editForm,setEditForm]=useState(EMPTY_FORM), [editSaving,setEditSaving]=useState(false);
  const [showCreate,setShowCreate]=useState(false), [createForm,setCreateForm]=useState(EMPTY_FORM), [createSaving,setCreateSaving]=useState(false);
  const [deleteId,setDeleteId]=useState<string|null>(null), [deleting,setDeleting]=useState(false);

  const reload=()=>{ setLoading(true); getAdminProjectStats().then(setStats).finally(()=>setLoading(false)); };
  useEffect(()=>reload(),[]);
  const openEdit=(p:AdminProject)=>{setEditProject(p);setEditForm({name:p.name,description:p.description,domain:p.domain});};
  const handleEditSave=async()=>{if(!editProject)return;setEditSaving(true);try{await updateProject(editProject.id,editForm.name,editForm.description,editForm.domain);setEditProject(null);reload();}finally{setEditSaving(false);}};
  const handleCreateSave=async()=>{setCreateSaving(true);try{await createProject(createForm.name,createForm.description,createForm.domain);setShowCreate(false);setCreateForm(EMPTY_FORM);reload();}finally{setCreateSaving(false);}};
  const handleDelete=async()=>{if(!deleteId)return;setDeleting(true);try{await deleteProject(deleteId);setDeleteId(null);reload();}finally{setDeleting(false);}};
  
  const allProjects=stats?.projects??[], filtered=allProjects.filter(p=>domainFilter==="all"?true:p.domain===domainFilter);
  const totalPages=Math.max(1,Math.ceil(filtered.length/ITEMS_PER_PAGE)), currentPage=Math.min(page,totalPages);
  const displayedProjects=filtered.slice((currentPage-1)*ITEMS_PER_PAGE,currentPage*ITEMS_PER_PAGE);

  const renderSelectItems=()=>DOMAIN_OPTIONS.map(d=><SelectItem key={d} value={d}>{DOMAIN_LABELS[d]}</SelectItem>);

  return(
    <AdminPageLayout className="bg-[#f1f1f9]">
      <div className="flex-1 p-8 space-y-6 min-w-0">
        <Card className="p-6 space-y-4">
          <PageHeader title="Projects" action={<Button className="bg-[#0A0A0A] text-white hover:bg-[#333]" onClick={()=>{setCreateForm(EMPTY_FORM);setShowCreate(true);}}>+ Create New Project</Button>}/>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[{label:"Total Projects",value:stats?.totalProjects,icon:<FolderOpen size={28}/>},{label:"Total Mentors",value:stats?.totalMentors,icon:<CheckCircle size={28} className="text-green-500"/>},{label:"Total Students",value:stats?.totalStudents,icon:<Users size={28} className="text-blue-500"/>}].map(c=>(
              <div key={c.label} className="flex items-center justify-between rounded-xl border border-[#E5E5E5] bg-[#fafafa] p-5"><div><p className="text-sm text-[#737373]">{c.label}</p><p className="text-3xl font-bold text-[#0A0A0A]">{loading?"—":c.value}</p></div>{c.icon}</div>
            ))}
          </div>
        </Card>

        <FilterBar>
          <FilterBar.Field label="Domain">
            <Select value={domainFilter} onValueChange={v=>{setDomainFilter(v);setPage(1);}}>
              <SelectTrigger className="w-[140px] bg-white border-[#E5E5E5]"><SelectValue placeholder="Domain"/></SelectTrigger>
              <SelectContent><SelectItem value="all">All Domains</SelectItem>{renderSelectItems()}</SelectContent>
            </Select>
          </FilterBar.Field>
          {domainFilter!=="all"&&<Button variant="ghost" className="text-[#737373] hover:text-[#0A0A0A]" onClick={()=>{setDomainFilter("all");setPage(1);}}>Reset</Button>}
        </FilterBar>

        <Card className="overflow-visible">
          <div className="w-full overflow-x-auto">
            <Table className="min-w-[700px]">
              <TableHeader>
                <TableRow className="bg-[#F5F5F5]">{["Project Name","Domain","Mentors","Students","Created By","Created Date",""].map(h=><TableHead key={h} className="text-xs font-bold uppercase text-[#737373] py-4 px-4">{h}</TableHead>)}</TableRow>
              </TableHeader>
              <TableBody>
                <TableStateRows colSpan={7} loading={loading} empty={!loading&&displayedProjects.length===0} loadingMessage="Loading projects…" emptyMessage="No projects found."/>
                {!loading && displayedProjects.map(p=>(
                  <TableRow key={p.id} className="hover:bg-[#F5F5F5]">
                    <TableCell className="py-4 px-6 flex items-center gap-3"><div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#F0F0F0] shrink-0">{DOMAIN_ICONS[p.domain]??<Globe size={18}/>}</div><span className="font-semibold text-[#0A0A0A]">{p.name}</span></TableCell>
                    <TableCell className="py-4 px-4"><span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#EBEBEB] text-[#0A0A0A]">{DOMAIN_LABELS[p.domain]??p.domain}</span></TableCell>
                    <TableCell className="py-4 px-4 text-[#0A0A0A] font-medium">{p.mentors}</TableCell>
                    <TableCell className="py-4 px-4 text-[#0A0A0A] font-medium">{p.students}</TableCell>
                    <TableCell className="py-4 px-4 text-[#0A0A0A] font-semibold">{p.createdBy}</TableCell>
                    <TableCell className="py-4 px-4 text-[#737373]">{p.createdDate}</TableCell>
                    <TableCell className="py-4 px-4">
                      <TableActionMenu ariaLabel={`Actions for ${p.name}`} items={[{label:"View Details",onSelect:()=>setViewProject(p)},{label:"Edit Project",onSelect:()=>openEdit(p)},{label:"Delete Project",onSelect:()=>setDeleteId(p.id),variant:"danger",separator:true,icon:<Trash2 size={14}/>}]}/>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <AdminPagination page={currentPage} totalPages={totalPages} total={filtered.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setPage}/>
        </Card>
      </div>

      {/** Reusable Dialogs */}
      {viewProject&&<Dialog open onOpenChange={open=>!open&&setViewProject(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Project Details</DialogTitle></DialogHeader>
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3"><div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#F0F0F0] shrink-0">{DOMAIN_ICONS[viewProject.domain]??<Globe size={18}/>}</div><p className="text-lg font-bold">{viewProject.name}</p></div>
            {viewProject.description&&<p>{viewProject.description}</p>}
            <div className="grid grid-cols-2 gap-4">
              {["Domain","Created Date","Mentors","Students"].map((l,i)=><div key={i}><p className="text-xs font-semibold uppercase text-[#737373]">{l}</p><p className="font-semibold">{l==="Domain"?DOMAIN_LABELS[viewProject.domain]:l==="Created Date"?viewProject.createdDate:l==="Mentors"?viewProject.mentors:viewProject.students}</p></div>)}
            </div>
            <div><p className="text-xs font-semibold uppercase text-[#737373]">Created By</p><p>{viewProject.createdBy}</p></div>
          </div>
          <DialogFooter><DialogClose asChild><Button variant="outline">Close</Button></DialogClose></DialogFooter>
        </DialogContent>
      </Dialog>}

      {[{show:editProject,set:setEditProject,form:editForm,setForm:setEditForm,onSave:handleEditSave,saving:editSaving,title:"Edit Project"},{show:showCreate,set:setShowCreate,form:createForm,setForm:setCreateForm,onSave:handleCreateSave,saving:createSaving,title:"Create New Project"}].map((d,i)=>d.show&&(
        <Dialog key={i} open onOpenChange={open=>!open&&d.set(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>{d.title}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5"><Label>Project Name</Label><Input value={d.form.name} onChange={e=>d.setForm(f=>({...f,name:e.target.value}))} placeholder="Enter project name"/></div>
              <div className="space-y-1.5"><Label>Description (optional)</Label><Textarea value={d.form.description} onChange={e=>d.setForm(f=>({...f,description:e.target.value}))} rows={3}/></div>
              <div className="space-y-1.5"><Label>Domain</Label><Select value={d.form.domain} onValueChange={v=>d.setForm(f=>({...f,domain:v}))}><SelectTrigger className="w-full"><SelectValue/></SelectTrigger><SelectContent>{renderSelectItems()}</SelectContent></Select></div>
            </div>
            <DialogFooter className="gap-2"><DialogClose asChild><Button variant="outline" disabled={d.saving}>Cancel</Button></DialogClose><Button className="bg-[#0A0A0A] text-white hover:bg-[#333]" onClick={d.onSave} disabled={d.saving||!d.form.name.trim()}>{d.saving?d.title.includes("Edit")?"Saving…":"Creating…":d.title.includes("Edit")?"Save Changes":"Create Project"}</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      ))}

      <ConfirmDeleteDialog open={!!deleteId} onOpenChange={open=>!open&&setDeleteId(null)} onConfirm={handleDelete} isPending={deleting} title="Delete Project" description="This will permanently delete the project and all associated data. This action cannot be undone."/>
    </AdminPageLayout>
  );
}