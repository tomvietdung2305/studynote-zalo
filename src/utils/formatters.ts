// Date formatters
export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('vi-VN');
};

export const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

export const formatDateTime = (timestamp: number): string => {
  return `${formatDate(timestamp)} ${formatTime(timestamp)}`;
};

export const formatRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'Vừa xong';
  if (minutes < 60) return `${minutes} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  if (days < 7) return `${days} ngày trước`;
  
  return formatDate(timestamp);
};

// Grade formatter
export const formatGrade = (score: number, maxScore: number = 10): string => {
  const percentage = (score / maxScore) * 100;
  return `${score}/${maxScore} (${percentage.toFixed(1)}%)`;
};

// Attendance formatter
export const getAttendanceStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    present: 'Có mặt',
    absent: 'Vắng mặt',
    late: 'Muộn',
    excused: 'Vắng có phép',
  };
  return labels[status] || status;
};

export const getAttendanceStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    present: 'green',
    absent: 'red',
    late: 'yellow',
    excused: 'blue',
  };
  return colors[status] || 'gray';
};
