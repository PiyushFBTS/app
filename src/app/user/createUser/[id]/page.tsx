
import { notFound } from 'next/navigation';
import { getUserbyId } from '@/lib/user';
import UserForm from '@/components/form/User/page';

export default async function EditUser({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const initialData = await getUserbyId(id);

    if (!initialData) return notFound();

    return (
        <div className="p-4">
            <UserForm initialData={initialData} isEditMode />
        </div>
    );
}
