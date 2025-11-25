import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Table } from '../common/Table';
import { Modal } from '../common/Modal';
import { useClasses } from '@/hooks/useApi';

export const WebClasses: React.FC = () => {
    const { classes, loading, createClass } = useClasses();
    const [showModal, setShowModal] = useState(false);
    const [newClassName, setNewClassName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const handleCreate = async () => {
        if (!newClassName.trim()) return;

        setIsCreating(true);
        try {
            await createClass({
                name: newClassName,
                schedules: [],
                students: [],
            });
            setNewClassName('');
            setShowModal(false);
        } catch (error) {
            console.error('Failed to create class:', error);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Classes</h1>
                    <p className="text-gray-600">Manage your classes and schedules</p>
                </div>
                <Button
                    variant="primary"
                    icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    }
                    onClick={() => setShowModal(true)}
                >
                    Add Class
                </Button>
            </div>

            <Card>
                <Table
                    data={classes}
                    loading={loading}
                    emptyMessage="No classes yet. Create one to get started!"
                    columns={[
                        {
                            header: 'Class Name',
                            key: 'name',
                            render: (cls) => (
                                <div>
                                    <p className="font-medium text-gray-900">{cls.name}</p>
                                    <p className="text-xs text-gray-500">ID: {cls.id}</p>
                                </div>
                            ),
                        },
                        {
                            header: 'Students',
                            key: 'total_students',
                            render: (cls) => (
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                    {cls.total_students || 0} students
                                </span>
                            ),
                        },
                        {
                            header: 'Schedule',
                            key: 'schedules',
                            render: (cls) => (
                                <span className="text-sm text-gray-600">
                                    {cls.schedules?.length || 0} sessions
                                </span>
                            ),
                        },
                        {
                            header: 'Created',
                            key: 'created_at',
                            render: (cls) => (
                                <span className="text-sm text-gray-600">
                                    {cls.created_at ? new Date(cls.created_at).toLocaleDateString() : '-'}
                                </span>
                            ),
                        },
                        {
                            header: 'Actions',
                            key: 'id',
                            render: (cls) => (
                                <div className="flex gap-2">
                                    <Button size="sm" variant="ghost">View</Button>
                                    <Button size="sm" variant="ghost">Edit</Button>
                                </div>
                            ),
                        },
                    ]}
                />
            </Card>

            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Create New Class"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleCreate}
                            loading={isCreating}
                            disabled={!newClassName.trim()}
                        >
                            Create Class
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Class Name
                        </label>
                        <input
                            type="text"
                            value={newClassName}
                            onChange={(e) => setNewClassName(e.target.value)}
                            placeholder="e.g., Piano K12"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};
