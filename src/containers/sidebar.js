var React = require("react"),
	ReactRedux = require("react-redux"),
	_ = require('lodash'),
	sortBy = require('sort-by'),
	numeral = require('numeral'),
	Loading = require("./../containers/loading"),
	Link = require("react-router").Link;
var Sidebar = React.createClass({
	render: function(){
		var current = this.props.pages.current;
		var user = this.props.auth.user;
		var tags = [];
		if (current.categories) {
			Object.keys(current.categories).forEach(function(category) {
				tags.push(<li><Link to={'/trending/' + category} activeClassName="active">#{category}</Link></li>);
			});
		}
		tags = tags.sort(sortBy('discussions'));
		tags = tags.slice(0, 20);
		if (current.feed_price) {
			var vests = user.vesting_shares;
			var totalVest = current.props.total_vesting_shares;
			var power = parseFloat(current.props.total_vesting_fund_steem) * (parseFloat(vests) / parseFloat(totalVest));
			var base = (current.feed_price.base).replace(' SBD', '').replace(',', '');
			var dollar = (parseFloat(base) * (parseFloat(user.balance) + parseFloat(power))) + parseFloat(user.sbd_balance);

		}
		return (
			<nav className="sidebar">
				<div className="sidebar-header">
					{this.props.auth.isAuthenticated && <div className="avatar">
						<div className="title name"><Link to={'/@' + user.name}>@{user.name}</Link></div>
					</div>}
				</div>
				<div className="sidebar-content">
					<ul className="list-selector">
						<li><a href="#" className="active"><i className="icon icon-md material-icons">public</i> World</a></li>
						<li><span><i className="icon icon-md material-icons">people</i> Friends</span></li>
					</ul>
					<ul className="tags">{tags}</ul>
				</div>
				<div className="sidebar-footer">
					{this.props.auth.isAuthenticated && <div className="avatar">
						<div className="balance">
							{current.feed_price && <div>{numeral(base).format('$0,0.00')} = 1 Steem</div>}
							<div className="title">Balances</div>
							<div>{numeral(user.balance).format('0,0.00')} Steem</div>
							{current.feed_price && <div>{numeral(power).format('0,0.00')} Steem Power</div>}
							<div>{numeral(user.sbd_balance).format('0,0.00')} Steem Dollars</div>
							{current.feed_price && <div>{numeral(dollar).format('$0,0.00')} Steem Dollars</div>}
						</div>
					</div>}
				</div>
			</nav>
		);
	}
});

var mapStateToProps = function(state){
	return {
		auth: state.auth,
		pages: state.pages
	};
};

module.exports = ReactRedux.connect(mapStateToProps)(Sidebar);