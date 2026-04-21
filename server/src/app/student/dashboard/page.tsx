"use client";

import React, { useState } from "react";
import {
	Clock,
	CheckCircle2,
	Eye,
	ListChecks,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { PageHeader } from "@/components/admin";
import { useIsMobile } from "@/_hooks/use-mobile";
import { useMenteeDashboard } from "@/_hooks/mentee";
import TableActionMenu from "@/components/admin/TableActionMenu";

type ActivityStatus = "APPROVED" | "PENDING" | "REJECTED";

type ActivityRow = {
	feedback: string;
	date: string;
	hours: number;
	status: ActivityStatus;
};

const analyticsMeta = [
	{
		label: "TOTAL HOURS LOGGED",
		icon: <Clock className="h-6 w-6 text-[#000053]" />,
	},
	{
		label: "TASKS COMPLETED",
		icon: <ListChecks className="h-6 w-6 text-[#000053]" />,
	},
	{
		label: "PENDING APPROVALS",
		icon: <CheckCircle2 className="h-6 w-6 text-[#000053]" />,
	},
];
const pageSize = 4;

function StatusBadge({ status }: { status: ActivityStatus }) {
	const map: Record<ActivityStatus, string> = {
		APPROVED: "bg-emerald-50 text-emerald-700 border border-emerald-100",
		PENDING: "bg-amber-50 text-amber-700 border border-amber-100",
		REJECTED: "bg-rose-50 text-rose-700 border border-rose-100",
	};
	return (
		<Badge className={`rounded-full px-2 py-1 text-[11px] font-semibold ${map[status]}`}>{status}</Badge>
	);
}

function ActivityDetailsContent({ activity }: { activity: ActivityRow }) {
	return (
		<div className="space-y-4 text-sm">
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div className="rounded-lg border border-[#e3ebf8] bg-[#f8fafe] p-3">
					<p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#737373]">Date</p>
					<p className="mt-1 text-[15px] font-semibold text-[#0A0A0A]">{activity.date}</p>
				</div>
				<div className="rounded-lg border border-[#e3ebf8] bg-[#f8fafe] p-3">
					<p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#737373]">Hours Logged</p>
					<p className="mt-1 text-[15px] font-semibold text-[#0A0A0A]">{activity.hours} hrs</p>
				</div>
			</div>
			<div className="rounded-lg border border-[#e3ebf8] p-4">
				<p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#737373]">Feedback</p>
				<p className="mt-2 text-[15px] text-[#0A0A0A] leading-relaxed">{activity.feedback}</p>
			</div>
			<div className="rounded-lg border border-[#e3ebf8] p-4">
				<p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#737373]">Status</p>
				<div className="mt-2">
					<StatusBadge status={activity.status} />
				</div>
			</div>
		</div>
	);
}

type ActivityDetailsViewerProps = {
	activity: ActivityRow | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

function ActivityDetailsViewer({
	activity,
	open,
	onOpenChange,
}: ActivityDetailsViewerProps) {
	const isMobile = useIsMobile();

	if (activity == null) {
		return null;
	}

	if (isMobile) {
		return (
			<Sheet open={open} onOpenChange={onOpenChange}>
				<SheetContent side="bottom" className="h-[85vh] overflow-y-auto rounded-t-2xl border-[#e3ebf8]">
					<SheetHeader>
						<SheetTitle>Activity Details</SheetTitle>
						<SheetDescription>
							Complete information for the selected activity log.
						</SheetDescription>
					</SheetHeader>
					<div className="mt-6">
						<ActivityDetailsContent activity={activity} />
					</div>
				</SheetContent>
			</Sheet>
		);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-lg border-[#e3ebf8]">
				<DialogHeader>
					<DialogTitle>Activity Details</DialogTitle>
					<DialogDescription>
						Complete information for the selected activity log.
					</DialogDescription>
				</DialogHeader>
				<ActivityDetailsContent activity={activity} />
			</DialogContent>
		</Dialog>
	);
}

export default function StudentDashboardPage() {
	const [page, setPage] = useState(1);
	const [selectedActivity, setSelectedActivity] = useState<ActivityRow | null>(null);
	const [isDetailsOpen, setIsDetailsOpen] = useState(false);

	const { data, isLoading, error } = useMenteeDashboard(page, pageSize);

	const totalPages = data?.pagination.totalPages ?? 1;
	const totalActivities = data?.pagination.totalItems ?? 0;

	const handleViewDetails = (item: ActivityRow) => {
		setSelectedActivity(item);
		setIsDetailsOpen(true);
	};

	const handleDetailsOpenChange = (open: boolean) => {
		setIsDetailsOpen(open);
		if (!open) {
			setSelectedActivity(null);
		}
	};

	const paginatedFeed: ActivityRow[] = data?.activities ?? [];

	const analytics = [
		{
			label: analyticsMeta[0].label,
			value: data?.stats.totalHoursLogged ?? 0,
			icon: analyticsMeta[0].icon,
		},
		{
			label: analyticsMeta[1].label,
			value: data?.stats.tasksCompleted ?? 0,
			icon: analyticsMeta[1].icon,
		},
		{
			label: analyticsMeta[2].label,
			value: data?.stats.pendingApprovals ?? 0,
			icon: analyticsMeta[2].icon,
		},
	];

	return (
		<div className="w-full min-h-screen bg-[#f1f1f9] px-2 py-2 sm:px-4 sm:py-4 md:px-6 md:py-6 xl:px-8 2xl:px-10">
			<div className="w-full mx-auto">
				{/* Header */}
				<div className="mb-4 sm:mb-6">
					<PageHeader
						title="Mentee Dashboard"
						subtitle="Analytics Overview"
					/>
				</div>

				{/* Analytics Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 xl:gap-5 mb-6 sm:mb-8">
					{analytics.map((item) => (
						<Card key={item.label} className="flex flex-col justify-between p-4 sm:p-5 bg-white border border-[#e3ebf8] shadow-sm h-full rounded-xl">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									{item.icon}
									<span className="text-[11px] font-semibold uppercase tracking-wider text-[#737373]">{item.label}</span>
								</div>
								{/* highlight removed */}
							</div>
							<div className="mt-3 sm:mt-4 flex items-end gap-2">
								<span className="text-3xl sm:text-4xl font-bold text-[#000053] leading-none">{item.value}</span>
							</div>
							{/* subtext removed */}
						</Card>
					))}
				</div>

				{/* Activity Feed */}
				<Card className="p-0 border-[#e3ebf8] shadow-sm rounded-2xl w-full">
					<div className="flex items-center justify-between px-4 sm:px-6 pt-4 sm:pt-6 pb-2">
						<div>
							<h2 className="text-[17px] sm:text-[18px] font-bold text-[#0A0A0A] leading-tight">Activity Feed</h2>
							<p className="text-[12px] sm:text-[13px] text-[#737373] mt-1">A detailed log of your work submissions and current status.</p>
						</div>
						{/* Removed filter icon and View All button */}
					</div>
					<CardContent className="p-0">
						{error && (
							<div className="mx-4 mb-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 sm:mx-6">
								{error.message || "Failed to load dashboard data."}
							</div>
						)}

						{/* Desktop / tablet table */}
						<div className="hidden md:block w-full overflow-x-auto min-h-[260px] xl:min-h-[320px] 2xl:min-h-[380px]">
							<Table>
								<TableHeader>
									<TableRow className="border-b border-[#e3ebf8]">
										<TableHead className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#737373] h-10 pl-6">Feedback</TableHead>
										<TableHead className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#737373] h-10">Date</TableHead>
										<TableHead className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#737373] h-10">Hours</TableHead>
										<TableHead className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#737373] h-10">Status</TableHead>
										<TableHead className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#737373] h-10 text-right pr-6">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{isLoading
										? [...Array(pageSize)].map((_, idx) => (
											<TableRow key={idx} className="border-b border-[#e3ebf8]">
												<TableCell className="pl-6 py-4" colSpan={5}>
													<div className="h-4 w-full animate-pulse rounded bg-slate-200" />
												</TableCell>
											</TableRow>
										))
										: paginatedFeed.length === 0
											? (
												<TableRow>
													<TableCell className="py-8 text-center text-sm text-[#737373]" colSpan={5}>
														No activities found.
													</TableCell>
												</TableRow>
											)
											: paginatedFeed.map((item, idx) => (
												<TableRow key={idx} className="border-b border-[#e3ebf8] hover:bg-[#f5f7fb] transition-colors">
													<TableCell className="font-semibold text-[15px] text-[#0A0A0A] pl-6">{item.feedback}</TableCell>
													<TableCell className="text-[15px] text-[#737373]">{item.date}</TableCell>
													<TableCell className="text-[15px] font-bold text-[#000053]">{item.hours} hrs</TableCell>
													<TableCell><StatusBadge status={item.status} /></TableCell>
													<TableCell className="text-right pr-6">
														<TableActionMenu
															ariaLabel={`Actions for activity on ${item.date}`}
															items={[
																{
																	label: "View",
																	icon: <Eye className="h-4 w-4 text-[#000053]" />,
																	onSelect: () => handleViewDetails(item),
																},
															]}
														/>
													</TableCell>
												</TableRow>
											))}
								</TableBody>
							</Table>
						</div>

						{/* Mobile card list */}
						<div className="md:hidden px-3 pb-3 space-y-3">
							{isLoading
								? [...Array(pageSize)].map((_, idx) => (
									<div key={idx} className="rounded-xl border border-[#e3ebf8] bg-white p-3">
										<div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
										<div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-slate-200" />
									</div>
								))
								: paginatedFeed.length === 0
									? (
										<div className="rounded-xl border border-dashed border-[#d4dceb] bg-white p-4 text-sm text-[#737373] text-center">
											No activities found.
										</div>
									)
									: paginatedFeed.map((item, idx) => (
								<div key={idx} className="rounded-xl border border-[#e3ebf8] bg-white p-3">
									<div className="flex items-start justify-between gap-3">
										<p className="text-[14px] font-semibold text-[#0A0A0A] leading-snug">{item.feedback}</p>
										<TableActionMenu
											ariaLabel={`Actions for activity on ${item.date}`}
											items={[
												{
													label: "View",
													icon: <Eye className="h-4 w-4 text-[#000053]" />,
													onSelect: () => handleViewDetails(item),
												},
											]}
										/>
									</div>
									<div className="mt-3 grid grid-cols-2 gap-3">
										<div>
											<p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#737373]">Date</p>
											<p className="mt-1 text-[13px] text-[#0A0A0A]">{item.date}</p>
										</div>
										<div>
											<p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#737373]">Hours</p>
											<p className="mt-1 text-[13px] font-semibold text-[#000053]">{item.hours} hrs</p>
										</div>
									</div>
									<div className="mt-3">
										<StatusBadge status={item.status} />
									</div>
								</div>
							))}
						</div>

						<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 py-3 xl:px-6 border-t border-[#e3ebf8] bg-[#fafbfc] rounded-b-2xl">
							<span className="text-xs text-[#737373] whitespace-nowrap">
								{isLoading
									? "Loading activities..."
									: `Showing ${paginatedFeed.length} of ${totalActivities} activities`}
							</span>
							<div className="flex justify-center sm:justify-end w-full sm:w-auto overflow-x-auto">
								<Pagination>
									<PaginationContent className="flex-wrap sm:flex-nowrap justify-center">
										<PaginationItem>
											<PaginationPrevious size="default" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} />
										</PaginationItem>
										{[...Array(totalPages)].map((_, i) => (
											<PaginationItem key={i}>
												<PaginationLink size="default" isActive={page === i + 1} onClick={() => setPage(i + 1)}>
													{i + 1}
												</PaginationLink>
											</PaginationItem>
										))}
										<PaginationItem>
											<PaginationNext size="default" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} />
										</PaginationItem>
									</PaginationContent>
								</Pagination>
							</div>
						</div>
					</CardContent>
				</Card>

				<ActivityDetailsViewer
					activity={selectedActivity}
					open={isDetailsOpen}
					onOpenChange={handleDetailsOpenChange}
				/>
			</div>
		</div>
	);
}
