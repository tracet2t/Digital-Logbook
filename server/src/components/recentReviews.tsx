import React, { useMemo, useState, useRef, useEffect } from "react";
import { ExternalLink, StickyNoteIcon, Search, CirclePlus, FilterIcon, ArrowDownUpIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

type Review = {
    id: number;
    status: "approved" | "rejected" | "pending";
    message: string;
    date: string;
};

const mockReviews: Review[] = [
    { id: 1, status: "approved", message: "Made minor updates and improvements.", date: "03/13/2025" },
    { id: 2, status: "rejected", message: "Designed wireframe to enhance the system’s UI/UX.", date: "03/12/2025" },
    { id: 3, status: "approved", message: "Designed wireframe to enhance the system’s UI/UX.", date: "03/12/2025" },
    { id: 4, status: "pending", message: "Designed wireframe to enhance the system’s UI/UX.", date: "03/12/2025" },
    { id: 5, status: "rejected", message: "Designed wireframe to enhance the system’s UI/UX.", date: "03/12/2025" },
    { id: 6, status: "pending", message: "Designed wireframe to enhance the system’s UI/UX.", date: "03/12/2025" },
    { id: 7, status: "approved", message: "Designed wireframe to enhance the system’s UI/UX.", date: "03/12/2025" },
    { id: 8, status: "rejected", message: "Designed wireframe to enhance the system’s UI/UX.", date: "03/12/2025" },
    { id: 9, status: "rejected", message: "Designed wireframe to enhance the system’s UI/UX.", date: "03/12/2025" },
    { id: 10, status: "pending", message: "Designed wireframe to enhance the system’s UI/UX.", date: "03/12/2025" },
];

interface RecentReviewsProps {
    onAddNewActivity: () => void;
    onUpdateActivity: () => void;
}

const RecentReviews: React.FC<RecentReviewsProps> = ({ onAddNewActivity, onUpdateActivity }) => {
    const [filter, setFilter] = useState<"all" | "approved" | "rejected" | "pending">("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);


    // Close flyout when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Memoize filtered submissions to prevent re-renders
    const filteredSubmissions = useMemo(
        () =>
            mockReviews.filter(
                (sub) =>
                    (filter === "all" || sub.status === filter) &&
                    (sub.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        sub.date.toLowerCase().includes(searchQuery.toLowerCase()))
            ),
        [filter, searchQuery]
    );

    const filteredReviews = filter === "all" ? mockReviews : mockReviews.filter((r) => r.status === filter);

    return (
        <div className="bg-white p-4 rounded-md shadow-md w-[800px] h-[400px] mx-auto">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-1">
                    <StickyNoteIcon className="w-8 h-8" />
                    <h2 className="font-medium text-lg">All Recent Reviews</h2>
                </div>
                <button
                    className="bg-[#5D13AF] text-white px-3 py-1  rounded-lg flex items-center"
                    onClick={onAddNewActivity} // Trigger modal from StudentDashboard
                >
                    <div className="relative flex items-center gap-1">
                        <CirclePlus className="w-5 h-5 text-black fill-gray-200" />

                        New Activity
                    </div>
                </button>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-[#959595] p-4 rounded-t-lg">
                {/* Search Input */}
                <div className="flex items-center gap-2">
                    <div className="relative w-[200px]">
                        <Input
                            placeholder="Search Reviews..."
                            className="bg-[#D9D9D9] px-10 py-2 border rounded-lg w-full pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-800" />
                    </div>
                    <button className="bg-white text-black px-3 py-1 rounded-lg">
                        Search
                    </button>
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-2">
                    <button className={`px-3 py-1 rounded-lg w-[90px] text-center font-medium ${filter === 'all' ? 'bg-[#5D13AF] text-white' : 'bg-[#D0BCFF] text-black'}`}
                        onClick={() => setFilter("all")}>
                        All
                    </button>
                    <button className={`px-3 py-1 rounded-lg w-[90px] text-center font-medium ${filter === 'pending' ? 'bg-[#5D13AF] text-white' : 'bg-[#D0BCFF] text-black'}`}
                        onClick={() => setFilter("pending")}>
                        Pending
                    </button>
                    <button className={`px-3 py-1 rounded-lg w-[90px] text-center font-medium ${filter === 'approved' ? 'bg-[#5D13AF] text-white' : 'bg-[#D0BCFF] text-black'}`}
                        onClick={() => setFilter("approved")}>
                        Approved
                    </button>
                    <button className={`px-3 py-1 rounded-lg w-[90px] text-center font-medium ${filter === 'rejected' ? 'bg-[#5D13AF] text-white' : 'bg-[#D0BCFF] text-black'}`}
                        onClick={() => setFilter("rejected")}>
                        Rejected
                    </button>
                    <div className="relative">
                        <button className="relative" onClick={() => setIsOpen(!isOpen)}>
                            <FilterIcon className="w-8 h-8" />
                            <ArrowDownUpIcon className="w-4 h-4 absolute bottom-0 right-0 translate-x-1" />
                        </button>

                        {isOpen && (
                            <div
                                ref={menuRef}
                                className="absolute left-1/2 top-full transform -translate-x-1/2 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-300 z-50"
                            >
                                <button className="flex items-center w-full px-4 py-2 hover:bg-gray-100">
                                    <FilterIcon className="w-6 h-6 mr-2" />
                                    ASC
                                </button>
                                <hr className="border-gray-300" />
                                <button className="flex items-center w-full px-4 py-2 hover:bg-gray-100">
                                    <FilterIcon className="w-6 h-6 mr-2" />
                                    DEC
                                </button>
                            </div>
                        )}
                    </div>


                </div>
            </div>

            <div className="bg-gray-100 max-h-60 overflow-y-auto min-h-[260px] w-full">
                {filteredReviews.length > 0 ? (
                    filteredReviews.map((review) => (
                        <div
                            key={review.id}
                            className={`flex justify-between items-center p-3 mb-2 rounded-lg transition-none
                            transition-all duration-200 border-2 border-transparent
                            ${review.status === "approved" ? "hover:border-green-300" : ""}
                            ${review.status === "rejected" ? "hover:border-red-300" : ""}
                            ${review.status === "pending" ? "hover:border-yellow-300" : ""}`}
                        >
                            <div className="flex items-center gap-2 w-2/3">
                                {review.status === "approved" ? (
                                    <span className="w-5 text-green-600">✔</span>
                                ) : review.status === "rejected" ? (
                                    <span className="w-5 text-red-600">❌</span>
                                ) : <span className="w-5 text-yellow-600">⏳</span>}
                                <p >{review.message}</p>
                            </div>
                            <span className="w-1/6 text-right text-gray-600 ml-auto">{review.date}</span>
                            <button className="text-black font-bold px-3 py-1 rounded"
                                onClick={onUpdateActivity}><ExternalLink className="w-5 h-5" /></button>
                        </div>
                    ))
                ) : (
                    <p className="p-3 text-center text-gray-500">No records found</p>
                )}
            </div>
        </div>
    );
};

export default RecentReviews;
