var React = require('react');
var ReactDOM = require('react-dom');
var _ = require('lodash');

class ListItem extends React.Component {
    render() {
        var icon = <i className={`fa fa-${this.props.icon} fa-fw`} aria-hidden="true"></i>;
        return <p className="ListItem">{icon} <b>{this.props.name}:</b> {this.props.children}</p>;
    }
}

function gigs(bytes){
    return (bytes / (1024 * 1024 * 1024)).toFixed(2);
}

function mbs(bytes){
    return (bytes / (1024 * 1024)).toFixed(2);
}

function BasicInfo({basicInfo}) {
    return (
        <div className="BasicInfo">
            <h1>Basic info</h1>
            <ListItem icon="user" name="User">{basicInfo.Username}</ListItem>
            <ListItem icon="desktop" name="Host">{basicInfo.Hostname}</ListItem>
            <ListItem icon="windows" name="OS">{basicInfo.OS}</ListItem>
            <ListItem icon="navicon" name="Free RAM">{gigs(basicInfo.FreeRam)} / {gigs(basicInfo.RAMSize)} GB</ListItem>
            <ListItem icon="cogs" name="CPU core count">{basicInfo.ProcessorCount}</ListItem>
            <ListItem icon="cog" name="CPU usage">{basicInfo.TotalCPUUsage.toFixed(2)} %</ListItem>
        </div>
    );
}

function TopProcessesHeaderRow(){
    return <tr>
        <th>Id</th>
        <th>Name</th>
        <th>RAM (MB)</th>
        <th>CPU %</th>
        <th>Threads</th>
    </tr>
}

function TopProcessesRow({process}){
    return <tr>
        <td>{process.Id}</td>
        <td>{process.Name}</td>
        <td>{mbs(process.WorkingSet)}</td>
        <td>{(process.CPUUsage * 100).toFixed(2)}</td>
        <td>{process.Threads}</td>
    </tr>
}

function ISS(){
    return <div className="ISS">
        <iframe width="560" height="315" src="https://www.youtube.com/embed/njCDZWTI-xg?rel=0&controls=0&showinfo=0&autoplay=1" frameborder="0" allowfullscreen></iframe>
    </div>
}

function TopProcesses({processes, filter, n}) {
    var rows = _.chain(processes).sortBy(filter).reverse().take(n).map(p=><TopProcessesRow key={p.Id} process={p} />).value();
    return <table className="TopProcesses">
        <thead>
            <TopProcessesHeaderRow />
        </thead>
        <tbody>
            {rows}
        </tbody>
    </table>
}

function TopRAMProcesses({processes}) {
    return <div className="TopRAMProcesses TopProcessesContainer">
        <h1>Top RAM</h1>
        <TopProcesses processes={processes} filter="WorkingSet" n={7} />
    </div>
}

function TopCPUProcesses({processes}) {
    return <div className="TopCPUProcesses TopProcessesContainer">
        <h1>Top CPU</h1>
        <TopProcesses processes={processes} filter="CPUUsage" n={7} />
    </div>
}

function Clock() {
    var now = new Date();
    return <div className="Clock">
        {now.getHours()}:{now.getMinutes()}:{now.getSeconds()}
    </div>;
}

function Main({basicInfo, processes, cpuInfo}){
    return (
        <div>
            <BasicInfo basicInfo={basicInfo} />
            <Clock />
            <TopRAMProcesses processes={processes} />
            <TopCPUProcesses processes={processes} />
            <ISS />
        </div>
    );
}

setInterval(_ => {
    var promises = [AntWall.getBasicInfo(), AntWall.getProcesses(), AntWall.getCPUInfo()];
    Promise
    .all([AntWall.getBasicInfo(), AntWall.getProcesses(), AntWall.getCPUInfo()])
    .then(function(res){
        ReactDOM.render(<Main basicInfo={res[0]} processes={res[1]} cpuInfo={res[2]} />, document.getElementById("container"));
    });
}, 500);