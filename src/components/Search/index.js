import React, { Component } from 'react';
import axios from 'axios'

import PageNavigation from '../PageNavigation'
import './styles.css';
import Loader from '../../loader.gif'
import CustomeTable from '../Table/Table';
import moment from 'moment';
class Search extends Component {

  constructor() {
    super()

    this.state = {
      startDate:moment().format('YYYY-MM-DD'),
      endDate:moment().format('YYYY-MM-DD'),
      query: '',
      results: {},
      loading: false,
      message: '',

      totalResults: 0,
      totalPages: 0,
      currentPageNo: 1,
    };

    this.cancel = '';
  }

  getPageCount = (total, denominator) => {
    const divisible = 0 === total % denominator;
    const valueToBeAdded = divisible ? 0 : 1;

    return Math.floor( total/denominator ) + valueToBeAdded
  }

  componentDidMount(){
    this.fetchSearchResults()
  }
  fetchSearchResults = (updatedPagNo = '', query) => {
    console.log("@@@@@@@@@@@@@@@@@222");
    const pageNumber = updatedPagNo ? `&page=${updatedPagNo}` : 1;
    console.log(pageNumber,"pageNumber");
    
    const searchUrl = `https://bikeindex.org:443/api/v3/search?page=${pageNumber}&per_page=${10}&location=Berlin&distance=10&stolenness=proximity`

   

    axios.get( searchUrl)
    .then(res => {
      const {data}=res
      const total = data.bikes.length;
      const totalPagesCount = 100

      const resultNotFoundMsg = ! data.bikes.length
                              ? 'There are no more search results. Please try a new search!'
                              : '';
      this.setState({
        results: data.bikes,
        message: resultNotFoundMsg,
        totalResults: total,
        totalPages: totalPagesCount,
        // currentPageNo: updatedPagNo,
        loading: false
      })
                            
    })
    .catch(error => {
      if(axios.isCancel(error) || error) {
        this.setState({
          loading: false,
          message: 'Failed to fetch the data. Please check network'
        })
      }
    })
  }

  handlePageClick = (type) => {
    // event.preventDefault();

    console.log(type,"typetypetype",(this.state.currentPageNo + 1));

    const updatePageNo = 'prev' === type
      ? Number(this.state.currentPageNo) - 1
      : Number(this.state.currentPageNo) + 1

      console.log(updatePageNo,"**************");

      if ( ! this.state.loading ) {
        this.setState({ 
          loading: true,
          message: '',
          // currentPageNo:2,
          currentPageNo:updatePageNo
         }, () => {
          console.log("api",this.state.currentPageNo);
           this.fetchSearchResults(updatePageNo, this.state.query)
         })
      }
  }

  renderSearchResults = () => {
    const { results } = this.state

    if (results && Object.keys(results).length && results.length) {
      return (
        <div className="results-container">
         <CustomeTable rowData={results}></CustomeTable>
        </div>
      )
    }
  }

  handleChange = (event) => {
    const query = event.target.value;
const final =this.state.results.filter(d=>d.title.indexOf(query)>=1);
console.log(">>>>>>>>>>>>>",final)
    if ( !query ) {
      this.fetchSearchResults(1, query)
      this.setState({
        query,
        // results: {},
        // message: '',
        // totalResults: 0,
        // totalPages: 0,
        // currentPageNo: 0
      })
    } else {
      this.setState({
        query: query,
        results:final,
        loading: false,
        message: '',
      }, () => {
        // this.fetchSearchResults(1, query)
      })
    }
  }

   onChangeDate = (date,key) => {
    const newDate = moment(new Date(date.target.value)).format('YYYY-MM-DD');
    // setValue(newDate);
    this.setState({
      ...this.state,[key]:newDate
    })
  };

  render() {
    const { query, loading, message, currentPageNo, totalPages } = this.state;

    const showPrevLink = 1 < currentPageNo
    const showNextLink = totalPages > currentPageNo;
    
    return (
      <div className="container">
        <label className="search-label" htmlFor="search-input">
          <input 
          type="text" 
          value={query} 
          name="query"
          id="search-input" 
          placeholder="Search..." 
          onChange={this.handleChange}
          />
          <i className="fa fa-search search-icon" aria-hidden="true" />
        </label>

        {/* Error message */}
       

        {/* Loading */}
        <img src={Loader} className={`search-loading ${loading ? 'show' : 'hide'}`} alt="loading" />

        {/* Navigation */}
       

        {/* Result */}
        <div style={{display:'flex',flex:1,justifyContent:'space-around'}}>
        <input type="date" value={this.state.startDate} onChange={(e)=>this.onChangeDate(e,"startDate")}/>
        <input type="date" value={this.state.endDate} onChange={(e)=>this.onChangeDate(e,"endDate")}/>
        <button onClick={()=>{
          let s = (x = new Date(this.state.startDate)) => x/1000 | 0;
          let e = (x = new Date(this.state.endDate)) => x/1000 | 0;
          let startDate=s()
          let endDate=e()

          var final=this.state.results.filter(res=>{
            if(res.date_stolen > startDate && res.date_stolen < endDate) {
              return res
           }
           
          })
          // alert(! final.lenght)
          if(! final.lenght){
            // alert('fdbfd')
            const resultNotFoundMsg = 'There are no more search results. Please try a new search!'
            this.setState({...this.state,results:final,message:resultNotFoundMsg})
            
                              
            // this.state({
            //   ...this.state,message:resultNotFoundMsg
            // })
          }else{
            this.setState({...this.state,results:final})
          }
          
          
        }}>Range Filter</button>
        </div>
        { message && <p className="message">{ message }</p> }
        {this.renderSearchResults()}

        {/* Navigation */}
        {!message && this.state.currentPageNo}
        <PageNavigation 
          loading={loading}
          showPrevLink={showPrevLink}
          showNextLink={showNextLink}
          handlePrevClick={() => this.handlePageClick('prev')} 
          handleNextClick={() => this.handlePageClick('next')}  
        />
    </div>
    )
  }
}

export default Search