import { VmDetail } from '@/features/developer/vm-detail';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MachineDetailPage({ params }: PageProps) {
  const { id } = await params;

  return <VmDetail vmId={id} />;
}
