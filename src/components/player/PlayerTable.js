import React, { useState, useEffect } from 'react'
import { Table, TableHead, TableRow, TableCell, TableBody, TableContainer } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    root: {
      width: '100%',
    },
    container: {
      maxHeight: 300,
    },
    tableRow: {
        height: 30
      },
    tableCell: {
        padding: "1px 2px"
    },
    tableHead: {
        padding: "1px 6px",
        backgroundColor: "#5353c6",
        color: "white"
    }
  });

export default function PlayerTable(props){
    const classes = useStyles();

    useEffect(()=>{
        updateMaximum()
    })

    const updateMaximum = () =>{
        if(props.data.position === "C"){
            props.updateMaximum(1)
        }
        else{
            props.updateMaximum(2)
        }
    }
    
    const formatNumber = (num, dp) => {
        if (num == undefined  || num == '' || isNaN(num)) return '0'
        return num.toFixed(dp).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

    return(
        <div>
            <TableContainer className={classes.container} style={{marginTop: '10px'}}>
                <Table stickyHeader className={classes.container}>
                    <TableHead>
                    <TableRow>
                        <TableCell align="left" className={classes.tableHead}>Team </TableCell>
                        <TableCell align="left" className={classes.tableHead}>Name</TableCell>
                        <TableCell align="right" className={classes.tableHead}>Salary</TableCell>
                        <TableCell align="right" className={classes.tableHead}>FPPG</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {props.data.players.map((player,index) => (
                        <TableRow 
                        key={index} onClick={()=>props.onSelectPlayer(player.position, player.playerId, player.selected, player.salary)} 
                        style={{cursor: 'pointer', backgroundColor: `${player.selected ? '#900C3F':'white'}`}}>
                            <TableCell align="left" className={classes.tableCell} style={{color: `${player.selected ? 'white':'black'}`, fontWeight: `${player.selected ? 'bold':'normal'}`}}>{player.team}</TableCell>
                            <TableCell align="left" className={classes.tableCell} style={{color: `${player.selected ? 'white':'black'}`, fontWeight: `${player.selected ? 'bold':'normal'}`}}>{"#"+player.jersey+" "+player.playerName}</TableCell>
                            <TableCell align="right" className={classes.tableCell} style={{color: `${player.selected ? 'white':'black'}`, fontWeight: `${player.selected ? 'bold':'normal'}`}}>{formatNumber(player.salary, 0)}</TableCell>
                            <TableCell align="right" className={classes.tableCell} style={{color: `${player.selected ? 'white':'black'}`, fontWeight: `${player.selected ? 'bold':'normal'}`}}>{player.fppg === 0 ? 'N/A' : formatNumber(player.fppg, 2)}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}