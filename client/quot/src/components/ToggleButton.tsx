import React, { Component } from "react";

interface ToggleButtonProps {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
}


class ToggleButton extends Component<ToggleButtonProps> {
    render() {
        return (
            <label className="switch">
                <input
                type="checkbox"
                checked={this.props.isDarkMode}
                onChange={this.props.toggleDarkMode}
                />
                <span className="slider round"></span>
            </label>
        )
    }
}

export default ToggleButton;