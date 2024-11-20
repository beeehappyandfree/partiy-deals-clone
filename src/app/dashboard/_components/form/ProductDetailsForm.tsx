'use client'

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { productDetailsSchema } from "@/schemas/product"
import { createProduct, updateProduct } from "@/server/actions/product"
import { useToast } from "@/hooks/use-toast"

export function ProductDetailsForm({
    product,
  }: {
    product?: {
      id: string
      name: string
      description: string | null
      url: string
    }
  }) {
    const { toast } = useToast()
    const form = useForm<z.infer<typeof productDetailsSchema>>({
        resolver: zodResolver(productDetailsSchema),
        defaultValues: product
        ? { ...product, description: product.description ?? "" }
        : {
            name: "",
            url: "",
            description: "",
        },
    })

    async function onSubmit(values: z.infer<typeof productDetailsSchema>) {
        const action = product == null ? createProduct : updateProduct.bind(null, product.id);
        const data = await action(values);
        if(data?.message) {
            toast({
                title: data.error ? "Error" : "Success",
                description: data.message,
                variant: data.error ? "destructive" : "default",
            })
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Product Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="url"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Enter your website URL</FormLabel>
                                <FormControl>
                                    <Input placeholder="Website URL" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Please include http:// or https:// and the full path to the sales page
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
<FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product Description</FormLabel>
                                <FormControl>
                                    <Textarea className="min-h-20 resize-none" placeholder="Product Description" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Enter a description of the product
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button className="self-end" type="submit" disabled={form.formState.isSubmitting}>
                    Save
                </Button>
            </form>
        </Form>
    )
}