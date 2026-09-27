import {
  DashboardSkeletonFrame,
  TransactionsSkeleton,
} from "@/components/dashboard/DashboardSkeletons";

export default function Loading() {
  return (
    <DashboardSkeletonFrame>
      <TransactionsSkeleton />
    </DashboardSkeletonFrame>
  );
}
