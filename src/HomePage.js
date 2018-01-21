import React, { Component, Fragment } from 'react'
import {
  Segment,
  Button,
  Grid,
  Icon,
  Loader,
  Modal,
  Table
} from 'semantic-ui-react'
import axios from "axios";


export default class HomepageLayout extends Component {
  state = {
    names: [],
    history: [],
    isFetched: false,
    isFetching: false
  }

  componentWillMount() {
    let that = this;

    axios.get('https://roomlottery.herokuapp.com/history')
    .then(response => {
      console.log(response)
      that.setState({history: response.data})
    })
    .catch(error => {
      console.log(error)
    })
  }

  fetchNames() {
    this.setState({
      isFetching: true,
      isFetched: false
    })
    let that = this;

    axios.get('https://roomlottery.herokuapp.com/lottery')
      .then(response => {
        console.log(response)
        that.setState({
          names: response.data,
          isFetching: false,
          isFetched: true
        })
      })
      .catch(error => {
        console.log(error)
        that.setState({isFetching: false})
      })
  }

  markComplete() {
    this.setState({
      isFetching: false,
      isFetched: false
    })
    let that = this;

    axios.post('https://roomlottery.herokuapp.com/completeLottery', that.state.names)
      .then(response => {
        console.log(response)
        //that.setState({history: response.data})
      })
      .catch(error => {
        console.log(error)
      })
  }

  render() {
    let {names, isFetching, isFetched, history} = this.state

    return (
      <div className="main-section">

        <h1 className="site-header">Book-A-Bed</h1>

        <Segment style={{ padding: '8em 0em' }} vertical>
          <Grid container stackable verticalAlign='middle' centered={true}>
            <Grid.Row>
              <Grid.Column width={8} stretched={true}>
                {
                  (!isFetching && !isFetched)
                  ? <Fragment>
                      <Button animated='fade' size="massive" secondary onClick={this.fetchNames.bind(this)}>
                        <Button.Content visible>
                          Start
                        </Button.Content>
                        <Button.Content hidden>
                          Ready to roll !!
                        </Button.Content>
                      </Button>
                      <HistoryModal history={history}/>
                    </Fragment>
                  : ''
                }

                {
                  (isFetching && !isFetched)
                  ? <Loader active>Fetching the lucky one(s)</Loader>
                  : <Results names={names} />
                }

                {
                  (names.length === 0)
                  ? ''
                  : <Button animated size="massive" secondary onClick={this.markComplete.bind(this)}>
                      <Button.Content visible>Lock Names</Button.Content>
                      <Button.Content hidden>
                        <Icon name='right checkmark' />
                      </Button.Content>
                    </Button>
                }
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </div>
    )
  }
}

const Results = (props) => (
  <div className="namesList">
    {
      props.names.map((name, index) => {
        return(
          <h3 key={index} className="user-name">{name}</h3>
        )
      })
    }
  </div>
)

const HistoryModal = (props) => (
  <Modal trigger={<a href="#" className="history-link" dimmer='blurring'><Icon name='history' />Show History</a>}>
    <Modal.Header>History</Modal.Header>
    <Modal.Content>
      <Modal.Description>
        <Table basic='very' celled striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Date</Table.HeaderCell>
              <Table.HeaderCell>Name(s)</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {
              props.history.map((data, index) => {
                return(
                  <Table.Row key={index}>
                    <Table.Cell>
                      {data[0]}
                    </Table.Cell>
                    <Table.Cell>
                      {data[1].toString()}
                    </Table.Cell>
                  </Table.Row>
                )
              })
            }

          </Table.Body>
        </Table>
      </Modal.Description>
    </Modal.Content>
  </Modal>
)