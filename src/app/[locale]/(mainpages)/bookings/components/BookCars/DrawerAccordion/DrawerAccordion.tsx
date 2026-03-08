import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/(components)/ui/accordion";

const items = [
  {
    value: "notifications",
    trigger: "تحديد السعر:",
    content:
      "Manage how you receive notifications. You can enable email alerts for updates or push notifications for mobile devices.",
  },
  {
    value: "privacy",
    trigger: "مكان الاستلام:",
    content: <div>Mohamed</div>,
  },
  {
    value: "billing",
    trigger: "التصنيف:",
    content:
      "View your current plan, payment history, and upcoming invoices. Update your payment method, change your subscription tier, or cancel your subscription.",
  },
  {
    value: "billing2",
    trigger: "ماركة السيارة:",
    content:
      "View your current plan, payment history, and upcoming invoices. Update your payment method, change your subscription tier, or cancel your subscription.",
  },
  {
    value: "billing3",
    trigger: "فئة السيارة:",
    content:
      "View your current plan, payment history, and upcoming invoices. Update your payment method, change your subscription tier, or cancel your subscription.",
  },
  {
    value: "billing4",
    trigger: "موديل السيارة:",
    content:
      "View your current plan, payment history, and upcoming invoices. Update your payment method, change your subscription tier, or cancel your subscription.",
  },
];

const DrawerAccordion = () => {
  return (
    <Accordion
      type="multiple"
      className="max-w-lg"
      defaultValue={["notifications"]}
    >
      {items.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.trigger}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default DrawerAccordion;
