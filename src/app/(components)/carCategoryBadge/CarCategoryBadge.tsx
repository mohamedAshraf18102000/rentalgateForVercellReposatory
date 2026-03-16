interface CarCategoryBadgeProps {
  icon: string;
  name: string;
}
const CarCategoryBadge = ({ icon, name }: CarCategoryBadgeProps) => {
  return (
    <div className="flex items-center gap-2">
      <p>{name}</p>
      <img
        src={`${process.env.NEXT_PUBLIC_IMAGES_PREFIX_URL}/${icon}`}
        alt=""
        className="object-contain w-24 h-10"
      />
    </div>
  );
};

export default CarCategoryBadge;
