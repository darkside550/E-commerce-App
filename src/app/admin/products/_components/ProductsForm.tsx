"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/formatters";
import React, { useState } from "react";
import { addProduct, updateProduct } from "../../_actions/products";
import { useFormState, useFormStatus } from "react-dom";
import { Product } from "@prisma/client";
import Image from "next/image";

const ProductForm = ({ product }: { product?: Product | null }) => {
  const [error, action] = useFormState(
    product == null ? addProduct : updateProduct.bind(null, product.id),
    {}
  );
  const [priceInPaisa, setPriceInPaisa] = useState<number | undefined>(product?.priceInPaisa);
  /*  TODO: COnvert in rs */

  return (
    <form action={action} className='space-y-8'>
      <div className='space-y-2'>
        <Label htmlFor='name'>Name</Label>
        <Input type='text' id='name' name='name' required defaultValue={product?.name || ""} />
        {error.name && <div className='text-destructive'>{error.name}</div>}
      </div>
      <div className='space-y-2'>
        <Label htmlFor='priceInPaisa'>Price in Paisa</Label> {/*  TODO: COnvert in rs */}
        <Input
          type='number'
          id='priceInPaisa'
          name='priceInPaisa'
          required
          value={priceInPaisa}
          onChange={(e) => setPriceInPaisa(Number(e.target.value) || undefined)}
        />
        <div className='text-muted-foreground'>{formatCurrency((priceInPaisa || 0) / 100)}</div>
        {error.priceInPaisa && <div className='text-destructive'>{error.priceInPaisa}</div>}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='description'>Description</Label>
        <Textarea
          id='description'
          name='description'
          required
          defaultValue={product?.description || ""}
        />
        {error.description && <div className='text-destructive'>{error.description}</div>}
      </div>
      <div className='space-y-2'>
        <Label htmlFor='file'>File</Label>
        <Input type='file' id='file' name='file' required={product == null} />
        {product != null && <div className='text-muted-foreground'>{product.filePath}</div>}
        {error.file && <div className='text-destructive'>{error.file}</div>}
      </div>
      <div className='space-y-2'>
        <Label htmlFor='image'>Image</Label>
        <Input type='file' id='image' name='image' required={product == null} />
        {product != null && (
          <Image src={product.imagePath} alt='product image' width='400' height='400'>
            {error.file}
          </Image>
        )}
        {error.image && <div className='text-destructive'>{error.image}</div>}
      </div>
      <SubmitButton />
    </form>
  );
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type='submit' disabled={pending}>
      {pending ? "Saving..." : "Save"}
    </Button>
  );
}

export default ProductForm;
