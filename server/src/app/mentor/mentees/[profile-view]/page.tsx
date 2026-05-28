import { Suspense } from "react";

import MenteeProfileView from "@/components/mentor/MenteeProfileView";

function MenteesPage() {
  return (
    <Suspense>
      <MenteeProfileView />
    </Suspense>
  );
}

export default MenteesPage;
