/**
 * Created by pappar on 2019/1/22.
 */
import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { debounce } from 'lodash'

class Navbar extends Component {
    state = {
        error: null,
        text : null,
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
        const text = this.state.text;
        console.log(text);
        this.setState({text:null});
        // return (<Redirect to={`/search/${text}`}/>);
        this.props.history.push(`/search/${text}`);
    }


    componentWillUnmount() {
        this.handleChange.cancel();
    }

    render() {
        const { error, results } = this.state;
        if (error) {
            return <div className="py-5">Error: {error.message}</div>;}
        else if (results){
            return (
                <nav className="navbar navbar-dark justify-content-between" style={{backgroundColor: "rebeccapurple"}}>
                    <a className="navbar-brand" href="/"><b>hOOk</b></a>
                    {/*<form className=" my-2 my-lg-0 d-flex d-md-none">*/}
                    {/*<input className="form-control mr-2 my-auto" type="search" placeholder="Search" aria-label="Search"/>*/}
                    {/*<button className="btn btn-outline-primary my-2 my-sm-0" type="submit">Go</button>*/}
                    {/*</form>*/}
                    <form className="form-inline my-2 my-lg-0 d-none d-md-flex" onSubmit={this.handleSearch.bind(this)}>
                        <input list="tvshowlist" className="form-control mr-sm-2" onChange={e => this.handleChange(e.target.value)} type="search" placeholder="Search TV shows" aria-label="Search"/>
                        {results
                            ? (
                                <datalist id="tvshowlist">
                                    {results.map(item => (
                                        <option key={item.id.toString()} value={item.name}/>
                                    ))}
                                </datalist>
                            )
                            : null
                        }

                        <button className="btn btn-outline-primary my-2 my-sm-0" type="submit">Search</button>
                    </form>
                </nav>
            );
        }

    }
}

export default withRouter(Navbar);