import * as React from 'react'
import { Form, Button, TextArea } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { getUploadUrl, updateProduct, uploadFile } from '../api/product-api'
import { Product } from '../types/Product'
import { getProduct } from '../api/product-api'
import { UpdateProductRequest } from '../types/UpdateProductRequest'
import { History } from 'history'

enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile,
}

interface EditProductsProps {
  match: {
    params: {
      productId: string
    }
  }
  auth: Auth
  history: History
}

interface EditProductState {
  file: any
  uploadState: UploadState
  productName: string
  productDescription: string
  productSize: string
  productPrice: number
  loading: boolean
  productId: string
  productSold: boolean
}

export class EditProduct extends React.PureComponent<
  EditProductsProps,
  EditProductState
> {
  state: EditProductState = {
    file: undefined,
    uploadState: UploadState.NoUpload,
    productName: '',
    productDescription: '',
    productSize: '',
    productPrice: 0,
    productId: '',
    productSold: false,
    loading: false
  }

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    this.setState({
      file: files[0]
    })
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('let update name')
    this.setState({ productName: event.target.value })
  }

  handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ productDescription: event.target.value })
  }

  handleSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ productSize: event.target.value })
  }

  handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ productPrice: Number(event.target.value) })
  }

  onUpdateProduct = async () => {
    const updateProductModel: UpdateProductRequest = {
      productName: this.state.productName,
      description: this.state.productDescription,
      size: this.state.productSize,
      price: this.state.productPrice,
      sold: this.state.productSold
    }
    console.log('Let update product', updateProductModel)

    try {
      const updatedProduct = await updateProduct(this.props.auth.getIdToken(), this.props.match.params.productId, updateProductModel)
      console.log('updated product', updatedProduct)
      this.props.history.push('/')
    } catch(err) {
      alert(`Product update failed ${err.message}`)
    }
  }

  handleFileSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      if (!this.state.file) {
        alert('File should be selected')
        return
      }

      this.setUploadState(UploadState.FetchingPresignedUrl)
      const uploadUrl = await getUploadUrl(this.props.auth.getIdToken(), this.props.match.params.productId)

      this.setUploadState(UploadState.UploadingFile)
      await uploadFile(uploadUrl, this.state.file)

      alert('File was uploaded!')
    } catch (e) {
      alert('Could not upload a file: ' + e.message)
    } finally {
      this.setUploadState(UploadState.NoUpload)
    }
  }

  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }

  async componentDidMount() {
    try {
      const product = await getProduct(this.props.auth.getIdToken(), this.props.match.params.productId)
      console.log('res', product)
      this.setState({
        productName: product.productName,
        productDescription: product.description,
        productPrice: product.price,
        productSize: product.size,
        productId: product.productId,
        productSold: product.sold,
        loading: false
      })
    } catch (e) {
      alert(`Failed to fetch product: ${e.message}`)
    }
  }


  renderForm() {
    return (
      <Form style={{width: '100%'}} onSubmit={()=> this.onUpdateProduct()}>
        <Form.Field>
          <label>Name</label>
          <input placeholder='Product Name' onChange={ this.handleNameChange } value={this.state.productName}/>
        </Form.Field>
        <Form.Field>
          <label>Size</label>
          <input placeholder='Product Size e.g 230ml, XL' onChange={ this.handleSizeChange } value={this.state.productSize}/>
        </Form.Field>
        <Form.Field>
          <label>Price</label>
          <input type='number' step='any' placeholder='Product Name' onChange={ this.handlePriceChange } value={this.state.productPrice || ''} />
        </Form.Field>
        <Form.Field
          control={TextArea}
          label='description'
          placehoslder='Product description....'
          value={this.state.productDescription}
          onChange={ this.handleDescriptionChange }/>
        <Button type='submit' >Update Product</Button>
      </Form>
    )
  }

  render() {
    return (
      <div>
        <h1>Upload new image</h1>

        <Form onSubmit={this.handleFileSubmit}>
          <Form.Field>
            <label>File</label>
            <input
              type="file"
              accept="image/*"
              placeholder="Image to upload"
              onChange={this.handleFileChange}
            />
          </Form.Field>

          {this.renderButton()}
        </Form>

        <div style={{height: '30px'}}></div>
        {this.renderForm()}
      </div>
    )
  }

  renderButton() {
    return (
      <div>
        {this.state.uploadState === UploadState.FetchingPresignedUrl && <p>Uploading image metadata</p>}
        {this.state.uploadState === UploadState.UploadingFile && <p>Uploading file</p>}
        <Button
          loading={this.state.uploadState !== UploadState.NoUpload}
          type="submit"
        >
          Upload
        </Button>
      </div>
    )
  }
}
