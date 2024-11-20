import { PageWithBackButton } from "@/app/dashboard/_components/PageWithBackButton"
import { getProduct } from "@/server/db/products"
import { auth } from "@clerk/nextjs/server"
import { notFound } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardTitle, CardContent, CardHeader } from "@/components/ui/card"
import { ProductDetailsForm } from "@/app/dashboard/_components/form/ProductDetailsForm"

export default async function EditProductPage({
    params: { productId },
    searchParams: { tab = "details" }
}: {
    params: { productId: string },
    searchParams: { tab?: string }
}) {

    const { userId, redirectToSignIn } = auth()
    if (userId == null) return redirectToSignIn()
    const product = await getProduct({ id: productId, userId })
    if (product == null) return notFound()

    return <PageWithBackButton backButtonHref="/dashboard/products" pageTitle="Edit Product">
        <Tabs defaultValue={tab}>
            <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="country">Country</TabsTrigger>
                <TabsTrigger value="customization">Customization</TabsTrigger>
            </TabsList>
            <TabsContent value="details">
                <DetailsTab product={product} />
            </TabsContent>
            <TabsContent value="country">Country</TabsContent>
            <TabsContent value="customization">Customization</TabsContent>
        </Tabs>
    </PageWithBackButton>
}

function DetailsTab({
    product,
  }: {
    product: {
      id: string
      name: string
      description: string | null
      url: string
    }
  }) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductDetailsForm product={product} />
        </CardContent>
      </Card>
    )
  }