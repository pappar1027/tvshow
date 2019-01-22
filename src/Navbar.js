/**
 * Created by pappar on 2019/1/22.
 */
import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { debounce } from 'lodash'
import ReactDatalist from 'react-datalist'

class Navbar extends Component {
    state = {
        error: null,
        text : '',
        results: []
    };
    handleChange = debounce((text) => {
        this.setState({text});
        if (text !== '') {
            fetch(`https://api.themoviedb.org/3/search/tv?api_key=5c42d570e7ecb65d2dca1264e2f80e37&language=en-US&query=${text}&page=1`)
                .then(res => res.json())
                .then(
                    (result) => {
                        this.setState({
                            results: result.results
                        });
                    },
                    (error) => {
                        this.setState({
                            error
                        });
                    }
                )
        }

    },500);
    handleSearch (e){
        e.preventDefault();
        //clear input and redirect
        if (this.state.text!=='') {
            this.inputTitle.setState({filter: ''});
            const text = this.state.text;
            this.setState({text:''},()=>{this.props.history.push(`/search/${text}`);});
        }
    }

    componentWillUnmount() {
        this.handleChange.cancel();
    }

    render() {
        const { error, results } = this.state;
        const options = [];
        results.map (item => options.push(item.name));
        if (error) {
            return <div className="py-5">Error: {error.message}</div>;}
        else if (results){
            return (
                <nav className="navbar navbar-dark justify-content-between" style={{backgroundColor: "rebeccapurple"}}>
                    <a className="navbar-brand" href="/"><b>hOOk</b></a>
                    <form className="form-inline my-2 my-lg-0" onSubmit={this.handleSearch.bind(this)}>
                        <ReactDatalist list="tvshowlist" className="form-control my-auto" options={options} placeholder="Search TV shows" onInputChange={e => this.handleChange(e.target.value)} ref={el => this.inputTitle = el}/>
                        <button className="btn btn-outline-primary my-auto ml-1" type="submit">Go</button>
                    </form>
                </nav>
            );
        }

    }
}

export default withRouter(Navbar);