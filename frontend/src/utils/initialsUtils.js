// Utility function to generate initials and random background colors
export const getClientInitials = (fullName) => {
  if (!fullName) return "?";
  
  const names = fullName.trim().split(" ");
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  
  const firstInitial = names[0].charAt(0).toUpperCase();
  const lastInitial = names[names.length - 1].charAt(0).toUpperCase();
  
  return `${firstInitial}${lastInitial}`;
};

// Generate consistent random color based on name
export const getInitialsColor = (fullName) => {
  if (!fullName) return "bg-gray-500";
  
  const colors = [
    "bg-red-500",
    "bg-blue-500", 
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-orange-500",
    "bg-cyan-500",
    "bg-emerald-500",
    "bg-violet-500",
    "bg-rose-500",
    "bg-amber-500",
    "bg-lime-500"
  ];
  
  // Use simple hash function to get consistent color for same name
  let hash = 0;
  for (let i = 0; i < fullName.length; i++) {
    hash = fullName.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const colorIndex = Math.abs(hash) % colors.length;
  return colors[colorIndex];
};