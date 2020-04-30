import React from 'react';
import ReactDOM from 'react-dom';
class Shopping extends React.Component {
    state = {
        shops: []
  }

  componentDidMount(){
    fetch('http://localhost:8000/shopping/')
    .then(response => response.json())
    .then(data => {
      this.setState({shops:data});
    });
  }

  createNewShop = (shop) => {
      // shop.id = Math.floor(Math.random() * 1000);
      // this.setState({shops: this.state.shops.concat([shop])});
      fetch('http://localhost:8000/shopping/',{
        method :'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify(shop),
      })
      .then(response => response.json())
      .then(shop =>{
        this.setState({shops:this.state.shops.concat([shop])});
      });
  }

updateShop = (newShop) => {
    fetch(`http://localhost:8000/shopping/${newShop.id}/`, {
        method: 'PUT',
        headers: {
                'Content-Type': 'application/json',
        },
        body: JSON.stringify(newShop),
    }).then(response => response.json())
    .then(newShop => {
        const newShops = this.state.shops.map(shop => {
            if(shop.id === newShop.id) {
                return Object.assign({}, newShop)
            } else {
                return shop;
            }
        });
        this.setState({shops: newShops});
    });
  }

  deleteShop = (shopId) => {
      console.log("test",shopId)
    fetch(`http://localhost:8000/shopping/${shopId}/`, {
    // fetch('http://localhost:8000/shopping/${bookId}/',{
      method: 'DELETE',
      headers:{
        'Content-Type': 'application/json',
      },
    })
    .then( ()=>{
    
      this.setState({shops: this.state.shops.filter(shop => shop.id !== shopId)})
    })
  }
  render() {
      return (
          <main className="d-flex justify-content-center my-4">
              <div  className="col-5">
                  <ShopList
                      shops={this.state.shops}
                      onDeleteClick={this.deleteShop}
                      onUpdateClick={this.updateShop}
                  />
                  <ToggleableShopForm
                      onShopCreate={this.createNewShop}
                  />
              </div>
          </main>
      )
  }
}

class ShopList extends React.Component {
  render() {
    const shops = this.props.shops.map(shop => (
      <EditableShop
        key={shop.id}
        id={shop.id}
        name={shop.name}
        shop_name={shop.shop_name}
        status={shop.status}
        onDeleteClick={this.props.onDeleteClick}
        onUpdateClick={this.props.onUpdateClick}
      ></EditableShop>
    ));
    return (
      <div>
        {shops}
      </div>
    );
  }
}

class EditableShop extends React.Component {
  state = {
    inEditMode: false
  };
  enterEditMode = () => {
    this.setState({inEditMode: true});
  }
  leaveEditMode = () => {
    this.setState({inEditMode: false});
  }
  handleDelete = () => {
    this.props.onDeleteClick(this.props.id);
  }
  handleUpdate = (shop) => {
    this.leaveEditMode()
    shop.id = this.props.id;
    this.props.onUpdateClick(shop);
  }
  render() {
    const component = () => {
      if(this.state.inEditMode) {
        return (
          <ShopForm
            id={this.props.id}
            name={this.props.name}
            shop_name={this.props.shop_name}
            status={this.props.status}
            onCancelClick={this.leaveEditMode}
            onFormSubmit={this.handleUpdate}
          />
        );
      }
      return (
        <Shop
          name={this.props.name}
          shop_name={this.props.shop_name}
          status={this.props.status}
          onEditClick={this.enterEditMode}
          onDeleteClick={this.handleDelete}
        />
      )
    }
    return (
      <div className="mb-3 p-4" style={{boxShadow: '0 0 10px #ccc'}} >
        {component()}
      </div>
    )
  }
}

class Shop extends React.Component {
  render() {
    return (
      <div className="card" /* style="width: 18rem;" */>
        <div className="card-header d-flex justify-content-between">
          <span>
            <strong>Name: </strong>{this.props.name}
          </span>
          <div>
            <span onClick={this.props.onEditClick} className="mr-2"><i className="far fa-edit"></i></span>
            <span onClick={this.props.onDeleteClick}><i className='fas fa-trash-alt'></i>
</span>
          </div>
        </div>
        <div className="card-body">
           <strong>Status:</strong> {this.props.status}
        </div>
        <div className="card-footer">
          <strong>Shop Name:</strong>  {this.props.shop_name}
        </div>
      </div>
    );
  }
}

class ShopForm extends React.Component {
  state = {
    name: this.props.name || '',
    shop_name: this.props.shop_name || '',
    status: this.props.status || ''
  }
  handleFormSubmit = (evt) => {
    evt.preventDefault();
    this.props.onFormSubmit({...this.state});
  }
  handleNameUpdate = (evt) => {
    this.setState({name: evt.target.value});
  }
  handleShopNameUpdate = (evt) => {
    this.setState({shop_name: evt.target.value});
  }
  handleStatusUpdate = (evt) => {
    this.setState({status: evt.target.value});
  }
  render() {
    const buttonText = this.props.id ? 'Update Shop': 'Create Shop';
    return (
      <form onSubmit={this.handleFormSubmit}>
        <div className="form-group">
          <label>
            Name
          </label>
          <input type="text" placeholder="Enter a Name"
            value={this.state.name} onChange={this.handleNameUpdate}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>
            Shop Name
          </label>
          <input type="text" placeholder="Shops's name"
            value={this.state.shop_name} onChange={this.handleShopNameUpdate}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>
            Status
          </label>
          <textarea className="form-control" placeholder="Shop Status"
            rows="5" value={this.state.status}
            onChange={this.handleStatusUpdate}
          >
            {this.state.status}
          </textarea>
        </div>
        <div className="form-group d-flex justify-content-between">
          <button type="submit" className="btn btn-md btn-primary">
            {buttonText}
          </button>
          <button type="button" className="btn btn-md btn-secondary" onClick={this.props.onCancelClick}>
            Cancel
          </button>
        </div>
      </form>
    )
  }
}

class ToggleableShopForm extends React.Component {
  state = {
    inCreateMode: false
  }
  handleCreateClick = () => {
    this.setState({inCreateMode: true});
  }
  leaveCreateMode = () => {
    this.setState({inCreateMode: false});
  }
  handleCancleClick = () => {
    this.leaveCreateMode();
  }
  handleFormSubmit = (shop) => {
    this.leaveCreateMode();
    this.props.onShopCreate(shop);
  }
  render() {
    if (this.state.inCreateMode) {
      return (
        <div className="mb-3 p-4" style={{boxShadow: '0 0 10px #ccc'}} >
          <ShopForm
            onFormSubmit={this.handleFormSubmit}
            onCancelClick={this.handleCancleClick}></ShopForm>
        </div>

      )
    }
    return (
      <button onClick={this.handleCreateClick} className="btn btn-secondary">
        <i className="fas fa-plus"></i>
      </button>
    );
  }
}

ReactDOM.render(<Shopping />, document.getElementById('root'));
