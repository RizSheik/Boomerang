import Container from "@/components/Container";
import AddressForm from "@/components/AddressForm";
import { backendClient } from "@/sanity/lib/backendClient";

export default async function EditAddressPage({ params }: { params: { id: string } }) {
  const doc = await backendClient.getDocument(params.id).catch(() => null);
  return (
    <Container className="py-10">
      <AddressForm
        title="Edit Address"
        initial={{
          name: doc?.name,
          email: doc?.email,
          address: doc?.address,
          city: doc?.city,
          state: doc?.state,
          zip: doc?.zip,
          isDefault: doc?.default,
        }}
        submitPath={`/api/address/${params.id}`}
        method="PUT"
      />
    </Container>
  );
}


