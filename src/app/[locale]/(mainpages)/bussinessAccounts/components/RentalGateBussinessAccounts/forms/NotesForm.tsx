import { Button } from "@/app/(components)";
import { Textarea } from "@/app/(components)/ui/textarea";
import { UserRound } from "lucide-react";
import { ChevronLeft } from "lucide-react";

const NotesForm = () => {
  return (
    <div className="mt-8 flex flex-col gap-4">
      <Textarea
        id="name"
        placeholder="اكتب ملاحظاتك وسيتواصل معك فريقنا في أقرب وقت."
        label="ملاحظات:"
        className="bg-white! border-2! border-Grey400! rounded-xl! text-base!"
        labelClassName="text-base text-primary"
        startIcon={<UserRound className="text-primary" />}
        rows={5}
      />
    </div>
  );
};

export default NotesForm;
