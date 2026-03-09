import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/(components)/ui/accordion";

interface UserExtraDetailsOccordionProps {
  title: string;
  content: React.ReactNode;
  icon: string;
}

const UserExtraDetailsOccordion = ({
  title,
  content,
  icon,
}: UserExtraDetailsOccordionProps) => {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full bg-Grey100 rounded-2xl p-1"
    >
      <AccordionItem value="shipping" className="border-none">
        <AccordionTrigger className="justify-start gap-2">
          <img src={icon} alt="img" className="w-[40px] h-[40px]" />
          <p className="text-base">{title}</p>
        </AccordionTrigger>
        <AccordionContent>{content}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default UserExtraDetailsOccordion;
