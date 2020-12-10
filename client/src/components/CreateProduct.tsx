import * as React from 'react'
import Auth from '../auth/Auth'
import { History } from 'history'
import { CreateProductRequest } from '../types/CreateProductRequest'
import { createProduct } from '../api/product-api'
import { Button, Form, Grid, TextArea } from 'semantic-ui-react'

interface CreateProductProps {
  auth: Auth,
  history: History
}

interface CreateProductState {
  name: string
  description: string
  size: string
  price: number,
  loading: boolean
}

export class CreateProduct extends React.PureComponent<CreateProductProps, CreateProductState> {
  state: CreateProductState = {
    name: '',
    description: '',
    size: '',
    price: 0,
    loading:false
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('let update name')
    this.setState({ name: event.target.value })
  }

  handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ description: event.target.value })
  }

  handleSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ size: event.target.value })
  }

  handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ price: Number(event.target.value) })
  }

  navigateToProductsPage = () => {
    this.props.history.push('/')
  }

  onProductCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    const productModel: CreateProductRequest = {
      productName: this.state.name,
      description: this.state.description,
      size: this.state.size,
      price: this.state.price
    }
    this.setState({ loading: true })
    try {
      const newProduct = await createProduct(this.props.auth.getIdToken(), productModel)
      this.setState({
        name: '',
        price: 0,
        description: '',
        size: '',
        loading: false
      })
    } catch {
      this.setState({ loading: false })
      alert('Product creation failed!')
    }
  }

  async onCreateProduct() {
    const newProductModel: CreateProductRequest = {
      productName: this.state.name,
      description: this.state.description,
      size: this.state.size,
      price: Number(this.state.price)
    }
    this.setState({ loading: true }) //lets set loading to true
    try {
      const createdProduct = await createProduct(this.props.auth.getIdToken(), newProductModel);
      this.setState({ loading: false })
      if(window.confirm('Product Created Successfully')) {
        this.navigateToProductsPage()
      }
    } catch(err) {
      alert(err.message)
    }
   

  }

  renderForm() {
    return (
      <Form style={{width: '100%'}} onSubmit={()=> this.onCreateProduct()}>
        <Form.Field>
          <label>Name</label>
          <input placeholder='Product Name' onChange={ this.handleNameChange } />
        </Form.Field>
        <Form.Field>
          <label>Size</label>
          <input placeholder='Product Size e.g 230ml, XL' onChange={ this.handleSizeChange } />
        </Form.Field>
        <Form.Field>
          <label>Price</label>
          <input type='number' step='any' placeholder='Product Name' onChange={ this.handlePriceChange } />
        </Form.Field>
        <Form.Field
          control={TextArea}
          label='description'
          placehoslder='Product description....'
          onChange={ this.handleDescriptionChange }/>
        <Button type='submit' >Create Product</Button>
      </Form>
    )
  }

  render() {
    return (
      <div>
        <Grid style={{ width: '100%' }}>
          <Grid.Row>
            <Grid.Column>
              <h3>Create Product Form</h3>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            { this.renderForm() }
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}