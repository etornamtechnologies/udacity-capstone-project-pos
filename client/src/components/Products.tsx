import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader,
  Card
} from 'semantic-ui-react'

import { createProduct, updateProduct, deleteProduct, getProducts } from '../api/product-api'
import Auth from '../auth/Auth'
import { Product } from '../types/Product'
import { CreateProductRequest } from '../types/CreateProductRequest'
import { UpdateProductRequest } from '../types/UpdateProductRequest'

interface ProductsProps {
  auth: Auth
  history: History
}

interface ProductsState {
  products: Product[]
  newProductName: string
  newProductPrice: number
  newProductDescription: string
  newProductSize: string
  loadingProducts: boolean
}

export class Products extends React.PureComponent<ProductsProps, ProductsState> {
  state: ProductsState = {
    products: [],
    newProductDescription: '',
    newProductName: '',
    newProductSize: '',
    newProductPrice: 0,
    loadingProducts: true
  }

  handleProductNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newProductName: event.target.value })
  }

  handleProductDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newProductDescription: event.target.value })
  }

  handleProductSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newProductSize: event.target.value })
  }

  handleProductPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newProductPrice: Number(event.target.value) })
  }

  onEditButtonClick = (productId: string) => {
    this.props.history.push(`/products/${productId}/edit`)
  }

  onCreateButtonClick = () => {
    console.log('let go to create product')
    this.props.history.push('/products/create')
  }

  truncateWithEllipses = (text: string, max: number) => {
    return text.substr(0,max-1)+(text.length>max?'...':''); 
  }

  onProductCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    const productModel: CreateProductRequest = {
      productName: this.state.newProductName,
      description: this.state.newProductDescription,
      size: this.state.newProductSize,
      price: this.state.newProductPrice
    }
    try {
      const newProduct = await createProduct(this.props.auth.getIdToken(), productModel)
      this.setState({
        products: [...this.state.products, newProduct],
        newProductName: '',
        newProductPrice: 0,
        newProductDescription: '',
        newProductSize: ''
      })
    } catch {
      alert('Product creation failed!')
    }
  }

  onProductDelete = async (productId: string) => {
    try {
      await deleteProduct(this.props.auth.getIdToken(), productId)
      this.setState({
        products: this.state.products.filter(product => product.productId != productId)
      })
    } catch {
      alert('Product deletion failed')
    }
  }

  onProductCheck = async (product: Product) => {
    console.log('product', product)
    const updatedProductModel: UpdateProductRequest = {
      productName: product.productName,
      description: product.description,
      size: product.size,
      price: product.price,
      sold: !product.sold
    } 
    try {
      const response = await updateProduct(this.props.auth.getIdToken(), product.productId, updatedProductModel)
      const index = this.state.products.findIndex(pd => pd.productId === product.productId)
      console.log('index', index)
      this.setState({
        products: update(this.state.products, {
          [index]: { sold: {$set: !product.sold} }
        })
      })
    } catch(err) {
      alert('Product update failed!')
    }
  }

  async componentDidMount() {
    try {
      const products = await getProducts(this.props.auth.getIdToken())
      this.setState({
        products,
        loadingProducts: false
      })
    } catch (e) {
      alert(`Failed to fetch products: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Products</Header>

        {this.renderCreateProductButton()}
      
        {this.renderProducts()}
      </div>
    )
  }

  

  renderCreateProductButton() {
    return (
      <Grid.Row style={{ marginBottom: '5px' }}>
        <Grid.Column>
          <Button onClick={() => this.onCreateButtonClick()}>Create New Product</Button>
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderProducts() {
    if (this.state.loadingProducts) {
      return this.renderLoading()
    }

    return this.renderProductsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Products
        </Loader>
      </Grid.Row>
    )
  }

  renderProductsList() {
    return (
      <div style={{width: '100%', display:'flex', flexDirection:'row', justifyContent:'flex-start', 
          alignItems:'center', padding:'10px'}}>
        {this.state.products.map((product, pos) => {
          console.log('attachment url', product.attachedImageUrl)
          return (
            <div style={{marginRight: '10px'}} key={product.productId}>
              {this.renderProductCard(product, pos)}
            </div>
          )
        })}
      </div>
    )
  }

  renderProductCard(product: Product, pos: number) {
    return (
      <Card style={{height: '400px'}}>
        <Image src={product.attachedImageUrl} style={{height: '50%'}} />
        <Card.Content>
          <Card.Header>{ product.productName }</Card.Header>
          <Card.Meta>{ product.size }</Card.Meta>
          <Card.Description style={{height: '30px'}}>{ this.truncateWithEllipses(product.description, 60) }</Card.Description>
          <Divider />
          <Card.Content extra>
            <div style={{width:'100%', display: 'flex', flexDirection:'row', justifyContent:'space-between', alignItems: 'center'}}>
              <div style={{height: '100%'}}>
                <span style={{fontSize: '16px', fontWeight: 'bold', color: '#000'}}>GHS {product.price}</span>
              </div>
              <Checkbox
                onChange={() => this.onProductCheck(product)}
                checked={product.sold}
              />   
              <Button color='blue' onClick={()=> this.onEditButtonClick(product.productId)}>
                <Icon name='pencil' />
              </Button>
              <Button color='red' onClick={()=> this.onProductDelete(product.productId)}>
                <Icon name='trash' />
              </Button>
            </div>
          </Card.Content>
        </Card.Content>
      </Card>
    ) 
  }

}
