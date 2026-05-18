"use client";

import React, { useState } from "react";

import { SidebarInset } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BulkUploadTabs } from "@/components/admin/Invitations/BulkUploadTabs";
import { BulkUploadTableProvider } from "@/_stores/bulkUploadTableStore";

import InvitationsMainContent from "./invitations-content";

export default function BulkUploadPage() {
  const [activeTab, setActiveTab] = useState("bulk-upload");

  const handleCancel = () => {
    setActiveTab("invitations");
  };

  return (
    <SidebarInset className="bg-[#f5f7fb]">
      <div className="flex-1 min-h-screen">
        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full h-full flex flex-col"
        >
          {/* Tab List */}
          <div className="border-b border-[#e4e7ed] bg-white sticky top-0 z-10">
            <TabsList className="w-full justify-start rounded-none bg-transparent p-0 h-auto gap-0">
              <TabsTrigger
                value="invitations"
                className="px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-b-[#000053] data-[state=active]:bg-transparent data-[state=active]:shadow-none text-slate-600 data-[state=active]:text-[#000053] font-semibold"
              >
                Invitations
              </TabsTrigger>
              <TabsTrigger
                value="bulk-upload"
                className="px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-b-[#000053] data-[state=active]:bg-transparent data-[state=active]:shadow-none text-slate-600 data-[state=active]:text-[#000053] font-semibold"
              >
                Bulk Upload
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Contents */}
          <div className="flex-1 overflow-auto bg-[#f5f7fb]">
            <TabsContent value="invitations" className="mt-0 h-full">
              <InvitationsMainContent
                onBulkUploadClick={() => setActiveTab("bulk-upload")}
              />
            </TabsContent>

            <TabsContent value="bulk-upload" className="mt-0 h-full p-5 md:p-8">
              <BulkUploadTableProvider>
                <BulkUploadTabs onCancel={handleCancel} />
              </BulkUploadTableProvider>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </SidebarInset>
  );
}
