import React from "react";

import Card from "../../../shared/components/Card/Card";
import Button from "../../../shared/components/Button/Button";

function TaskItem(props) {

    return (
        <li>
            <Card>
                <div>
                    <i className="material-icons">check_box_outline_blank</i>
                    <h2>{props.name}</h2>
                </div>
                {
                    props.responsibility &&
                    <div>
                        <h3>Responsibility</h3>
                        <p>{props.responsibility}</p>
                    </div>
                }
                {
                    props.etc &&
                    <div>
                        <h3>ETC</h3>
                        <p>{props.etc}</p>
                    </div>
                }
                {
                    props.dueDate &&
                    <div>
                        <h3>Due Date</h3>
                        <p>{props.dueDate}</p>
                    </div>
                }
                <div>
                    <Button>
                        <i className="material-icons"
                        >
                            delete
                        </i>
                    </Button>
                    <Button>
                        <i
                            className="material-icons"
                        >
                            edit
                        </i>
                    </Button>
                </div>
            </Card>
        </li>
    )
}

export default TaskItem;