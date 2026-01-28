import ProductForm from '@/components/products/ProductForm'
import Card from '@/components/ui/Card'

export default function NewProductPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card className="p-6 md:p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">상품 등록</h1>
        <ProductForm />
      </Card>
    </div>
  )
}
