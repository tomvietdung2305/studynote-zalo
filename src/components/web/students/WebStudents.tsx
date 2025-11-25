import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { useClasses } from '@/hooks/useApi';

export const WebStudents: React.FC = () => {
    const { classes, loading } = useClasses();

    // Calculate all students across all classes
    const allStudents = classes.flatMap(cls =>
        Array(cls.total_students || 0).fill(null).map((_, idx) => ({
            id: `${cls.id}-${idx}`,
            name: `Student ${idx + 1}`,
            class: cls.name,
            classId: cls.id,
        }))
    );

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Students</h1>
                    <p className="text-gray-600">View and manage all students</p>
                </div>
            </div>

            {loading ? (
                <Card>
                    <div className="text-center py-12">Loading students...</div>
                </Card>
            ) : allStudents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allStudents.map((student) => (
                        <Card key={student.id} padding="md">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                                    {student.name[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 truncate">{student.name}</p>
                                    <p className="text-sm text-gray-500 truncate">{student.class}</p>
                                    <div className="mt-3 flex gap-2">
                                        <Button size="sm" variant="ghost">View</Button>
                                        <Button size="sm" variant="ghost">Report</Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <div className="text-center py-12">
                        <div className="text-5xl mb-4">👥</div>
                        <p className="text-gray-600 mb-4">No students yet</p>
                        <p className="text-sm text-gray-500">Students will appear here when you add them to your classes</p>
                    </div>
                </Card>
            )}
        </div>
    );
};
