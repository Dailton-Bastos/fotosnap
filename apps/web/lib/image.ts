export const getImageUrl = (imagePath: string | null) => {
  if (!imagePath) {
    return '';
  }
  return `${process.env.NEXT_PUBLIC_API_URL}/uploads/images/${imagePath}`;
};
