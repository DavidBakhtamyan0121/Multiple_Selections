import './styles.css'
import { useEffect, useRef, useState } from "react";

const MultipleSelection = () => {
    const usStates = [
        "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
        "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
        "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
        "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
        "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
        "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota",
        "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island",
        "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
        "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
    ];
    const [input, setInput] = useState('')
    const [suggestionInput, setSuggestionInput] = useState('Choose several states...');
    const inputRef = useRef(null)
    const dropdownRef = useRef(null)
    const [focusIndex, setFocusIndex] = useState(-1)
    const [dropdown, setDropdown] = useState(false)
    const [filteredState, setFilteredStates] = useState([...usStates])
    const [selected, setSelected] = useState([])

    function replace(str, target) {
        const regex = new RegExp(target, "i");
        return str.replace(regex, target);
    }


    const handelSuggestion = (e) =>{
        setSuggestionInput(e.target.value)
    }

    const handleChange = (e) => {
        let value = e.target.value
        let filterdUsStates = usStates.filter(el => el.toLocaleLowerCase().includes(value.toLocaleLowerCase()))
        let filtered = filterdUsStates.filter(el => !selected.includes(el))
        //dropdown logic
        if (!value) {
            setDropdown(false)
        } else {
            setDropdown(true)
        }

        //second input logic
        if(!value && !selected.length){
            setSuggestionInput('Choose several states...')
        }
        else{
            setSuggestionInput('')
        }

        if (value) {
            const match = filtered.find((s) =>
              s.toLowerCase().startsWith(value.toLowerCase())
            )
            setSuggestionInput(match ? replace(match, value) : "");
          } else {
            setSuggestionInput("");
          }

        setFilteredStates(filtered)
        setInput(e.target.value)
    }


    const handleSelection = (state) => {
        inputRef.current.focus()
        setSuggestionInput('')
        setFilteredStates([...usStates])
        setDropdown(false)
        setInput('')
        setSelected([...selected,state])
    }

    const removeSelection = (state) => {
        if(selected.length === 1) setSuggestionInput('Choose several states...')
        setSelected(prev => [...prev.filter(el => el !== state)])
    }

    const highlight = (text, highlight) => {
        if (!highlight) return text;

        const regex = new RegExp(`(${highlight})`, "gi");
        const parts = text.split(regex);

        return parts.map((part, index) =>
            regex.test(part) ? (
                <strong key={index} style={{ fontWeight: "bold" }}>
                    {part}
                </strong>
            ) : (
                part
            )
        );
    };
   
    const listener = (event) => {
        if ((!inputRef.current || inputRef.current.contains(event.target)) || (!dropdownRef.current || dropdownRef.current.contains(event.target))) {
            setFocusIndex(-1)
            return;
        }
        setDropdown(false)
        setFocusIndex(-1)
    };
    
    useEffect(() => {
        const backspaceDelete = (e) =>{
            if (e.key === 'Backspace' && !input) {            
                if(focusIndex !== -1){
                    setSelected(prev => prev.filter((el, index) => index !== focusIndex))
                    setFocusIndex(-1)
                }else{
                    console.log(selected);
                    setFocusIndex(selected.length-1)
                }
            }
        }
        document.addEventListener("mousedown", listener);
        window.addEventListener("keydown", backspaceDelete)

        return () => {
            document.removeEventListener("mousedown", listener);
            window.removeEventListener("keydown", backspaceDelete)
        };
    }, [focusIndex, selected, input]);

    return (
        <div className={"MultipleSelection"}>
            <p>Multiple Selections</p>
            <div className='InputContainer'>
                <div className="SelectedContainer">
                    {
                        selected.map((el, index) => (
                            <div
                                key={index}
                                className= {focusIndex === index ? 'SelectedItem focused' : 'SelectedItem'}>
                                <span onClick={() => setFocusIndex(index)}>{el}</span>
                                <span onClick={() => removeSelection(el)}>x</span>
                            </div>
                        ))
                    }
                    <div className="Inputs">
                        <input
                            type="text"
                            className={'SelectionInput'}
                            onClick={() => setDropdown(true)}
                            value={input}
                            onChange={handleChange}
                            ref={inputRef}
                        />
                        <input
                            className='SuggestionInput'
                            value={suggestionInput}
                            onChange={handelSuggestion}
                        />
                    </div>
                    
                    {
                        dropdown && (
                            <div className="dropdown" ref={dropdownRef}>
                                {(!filteredState.length && input.length) && (
                                    <span className='noMatches'>No matches found</span>
                                )
                                }
                                {filteredState.map((el, index) => {
                                    return (!selected.includes(el))&&(
                                        <span
                                            key={index}
                                            onClick={() => handleSelection(el)}
                                            className={'dropdownItem'}>
                                            {highlight(el, input)}
                                        </span>
                                    )

                                })}

                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default MultipleSelection;