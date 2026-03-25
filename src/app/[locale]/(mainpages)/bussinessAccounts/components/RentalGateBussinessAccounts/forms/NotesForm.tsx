import { Textarea } from "@/app/(components)/ui/textarea";
import { UserRound } from "lucide-react";
import { useFormContext } from "react-hook-form";

const NotesForm = () => {
  const { register } = useFormContext();
  
  return (
    <div className="mt-8 flex flex-col gap-4">
      <Textarea
        id="notes"
        placeholder="اكتب ملاحظاتك وسيتواصل معك فريقنا في أقرب وقت."
        label="ملاحظات:"
        className="bg-white! border-2! border-Grey400! rounded-xl! text-base!"
        labelClassName="text-base text-primary"
        startIcon={<UserRound className="text-primary" />}
        rows={5}
        {...register("notes")}
      />
    </div>
  );
};

export default NotesForm;
