'use client';

import React, { useEffect, useState } from 'react';

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CalendarDays, Clock, FileText, MessageSquare, CheckCircle2, XCircle } from 'lucide-react';

interface MentorPopUpProps {
  isOpen: boolean;
  onClose: () => void;
  mentorDetails: {
    id: string; 
    selectedDate: string;
    workingHours: string;
    studentActivity: string;
    review: string;
    ismentor: boolean;
  };
}

const MentorPopUp: React.FC<MentorPopUpProps> = ({ isOpen, onClose, mentorDetails }) => {
  const [review, setReview] = useState<string>(mentorDetails.review || '');

  useEffect(() => {
    const fetchMentorActivity = async () => {
      try {
        const response = await fetch(`/api/mentor-activity/${mentorDetails.id}`);
        if (response.ok) {
          const data = await response.json();
          setReview(data.activities || '');
        } else {
          console.error('Failed to fetch ');
        }
      } catch (error) {
        console.error('Error fetching ', error);
      }
    };

    if (mentorDetails.id) {
      fetchMentorActivity();
    }
  }, [mentorDetails.id]);

  const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReview(e.target.value);
  };

  const handleAccept = async () => {
    try {
      const response = await fetch(`/api/mentor-activity/${mentorDetails.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ review }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Review updated successfully", data);
      } else {
        console.error('Failed to update review');
      }
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  const handleReject = () => {
    console.log("Task Rejected");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl p-0 rounded-2xl overflow-hidden border border-gray-200 shadow-2xl">

        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-5">
          <DialogHeader>
            <DialogTitle className="text-white text-xl font-semibold tracking-tight">
              Mentor Task Detail
            </DialogTitle>
            <p className="text-slate-400 text-sm mt-0.5">Review and respond to the student`s activity</p>
          </DialogHeader>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 bg-white">

          {/* Stat Cards: Date & Working Hours */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-slate-200 flex items-center justify-center">
                <CalendarDays className="w-4 h-4 text-slate-600" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Date</p>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">
                  {mentorDetails.selectedDate || '—'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-slate-200 flex items-center justify-center">
                <Clock className="w-4 h-4 text-slate-600" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Working Hours</p>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">
                  {mentorDetails.workingHours ? `${mentorDetails.workingHours} hrs` : '—'}
                </p>
              </div>
            </div>
          </div>

          {/* Activity Card */}
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-200">
              <FileText className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">Student Activity</span>
            </div>
            <div className="px-4 py-3 text-sm text-slate-700 min-h-[100px] leading-relaxed whitespace-pre-wrap bg-white">
              {mentorDetails.studentActivity || <span className="text-slate-400 italic">No activity recorded</span>}
            </div>
          </div>

          {/* Review */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                Your Review
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400 ml-0.5" />
              </Label>
              <span className="text-xs text-slate-400">{review.length} chars</span>
            </div>
            <Textarea
              value={review}
              onChange={handleReviewChange}
              placeholder="Write your review here…"
              rows={4}
              className="rounded-xl bg-white border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 resize-none focus-visible:ring-2 focus-visible:ring-slate-400/40 focus-visible:ring-offset-0"
            />
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-row items-center justify-end gap-2">
          <Button
            variant="ghost"
            onClick={onClose}
            className="rounded-xl text-slate-600 hover:bg-slate-200 hover:text-slate-800"
          >
            Close
          </Button>
          <Button
            onClick={handleReject}
            className="rounded-xl bg-red-500 hover:bg-red-600 text-white gap-1.5 shadow-sm"
          >
            <XCircle className="w-4 h-4" />
            Reject
          </Button>
          <Button
            onClick={handleAccept}
            className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4" />
            Accept
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
};



export default MentorPopUp
