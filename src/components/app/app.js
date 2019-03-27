import React, {Component} from 'react';

import AppHeader from '../app-header';
import SearchPanel from '../search-panel/';
import TodoList from '../todo-list/';
import ItemStatusFilter from '../item-status-filter/';
import AddItem from '../add-item/';

export default class App extends Component {

    maxId = 100;

    state={
        todoData:[
            this.createTodoItem('Drink Coffee'),
            this.createTodoItem('Make Awesome App'),
            this.createTodoItem('Have a lunch')
        ],
        term:'',
        filter:'all' // active, all, done
    }


    createTodoItem(label){
        return {
            label: label,
            important: false,
            done: false,
            id: this.maxId++
        }
    }

    deleteItem = (id)=>{
        this.setState(({todoData})=>{
            const idx = todoData.findIndex((el)=>el.id===id);

            const newArray = [...todoData.slice(0, idx), ...todoData.slice(idx+1)];
            return{
                todoData: newArray
            }
        })
    }
    addItem = (text)=>{
        //generate id

        const newItem = this.createTodoItem(text);

        //add element to array
        this.setState(({todoData})=>{
            const newArray = [...todoData, newItem];
            return{
                todoData: newArray
            }
        })
    }

    toggleProperty(arr, id, propName){
        const idx = arr.findIndex((el)=>el.id===id);

        //    Update object
        const oldItem = arr[idx];
        const newItem = {...oldItem, [propName]: !oldItem[propName]};

        //    Construct new array
        return[...arr.slice(0, idx), newItem, ...arr.slice(idx+1)];
    }

    onToggleImportant = (id)=>{
        this.setState(({todoData})=>{
            return{
                todoData: this.toggleProperty(todoData,id,'important')

        }
        })
    }

    onToggleDone = (id)=>{
        this.setState(({todoData})=>{
            return{
                todoData: this.toggleProperty(todoData,id,'done')

            }
        })
    }

    search = (items, term)=>{
        if(term.length === 0){
            return items;
        }
        return items.filter((el)=>{
            return el.label.toLowerCase().indexOf(term.toLowerCase())>-1;
        })
    }

    onSearchChange = (term)=>{
        this.setState({term})
    }

    changeButtonView = (e)=>{
        const buttons = document.querySelectorAll('button[type="button"]');
        console.log(buttons);
        buttons.forEach((el)=>{
             el.classList.remove('btn-info');
             el.classList.add('btn-outline-secondary');
        })
        e.target.classList.add('btn-info');
        e.target.classList.remove('btn-outline-secondary');
    }

    onActive = (e) =>{
        this.setState({filter:'active'});
        this.changeButtonView(e);
    }
    onDone = (e) =>{
        this.setState({filter:'done'});
        this.changeButtonView(e);
    }
    onAll = (e)=>{
        this.setState({filter:'all'});
        this.changeButtonView(e);
    }

    onFilterItems = (items)=>{

        switch (this.state.filter){
            case 'all': return items;
            case 'active': return items.filter((el)=>!el.done);
            case 'done': return items.filter((el)=>el.done);

        }
    }

    render(){
        const {todoData, term} = this.state;

        const visibleItems = this.onFilterItems(this.search(todoData, term));
        const doneCount = todoData.filter((el)=>el.done === true).length;
        const todoCount = todoData.length - doneCount;
        return(
            <div className="todo-app">
                <AppHeader toDo={todoCount} done={doneCount} />
                <div className="top-panel d-flex">
                    <SearchPanel
                        onSearchChange = {this.onSearchChange}
                    />
                    <ItemStatusFilter
                        onActive = {this.onActive}
                        onDone = {this.onDone}
                        onAll = {this.onAll}
                    />
                </div>
                <TodoList todos={visibleItems}
                          onDeleted ={this.deleteItem}
                          onToggleImportant = {this.onToggleImportant}
                          onToggleDone = {this.onToggleDone}
                />
                <AddItem addItem={this.addItem}/>
            </div>
        )
    }
}