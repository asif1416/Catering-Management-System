import { Card, CardHeader, CardBody } from "@nextui-org/react";
import Image from "next/image";

const CustomerCard = ({ customer }: { customer: { name: string; email: string; address: string } }) => {
  return (
    <Card className="py-4 w-full max-w-sm mx-auto">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <p className="text-tiny uppercase font-bold">Customer Information</p>
        <h4 className="font-bold text-large">{customer.name || "N/A"}</h4>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <Image
          alt="Customer avatar"
          className="object-cover rounded-xl"
          src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
          width={270}
          height={270}
        />
        <div className="mt-4">
          <p>
            <strong>Email:</strong> {customer.email || "N/A"}
          </p>
          <p>
            <strong>Address:</strong> {customer.address || "Not provided"}
          </p>
        </div>
      </CardBody>
    </Card>
  );
};

export default CustomerCard;
