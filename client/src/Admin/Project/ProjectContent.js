import React, { useState, useEffect } from "react";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import DoneRoundedIcon from "@material-ui/icons/DoneRounded";
import SearchRoundedIcon from "@material-ui/icons/SearchRounded";
import AddIcon from "@material-ui/icons/Add";
import { NavLink } from "react-router-dom";
import "./ProjectContent.css";
import { TablePagination } from "@material-ui/core";
import { saveProId } from "../../features/editpro";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { isAuthenticate } from "../../auth/token";

function ProjectContent() {
  const [showChatOptions1, setShowChatOptions1] = useState(false);
  const [showChatOptions2, setShowChatOptions2] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [message, setMessage] = useState("");
  const [sample, setSample] = useState("");
  const [projects, setProjects] = useState([]);
  const { token } = isAuthenticate();

  const [total, setTotal] = useState();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(2);
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(async () => {
    let paging = "";
    if (teamName == "") {
      paging = `limit=${rowsPerPage}&page=${page + 1}`;
    } else {
      paging = "";
    }
    const tn = teamName ? `&teamName=${teamName}` : "";
    await fetch(
      `/admin/projects/?${paging}${tn}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then(({ projects, totalCount, message }) => {
        console.log(projects);
        if (message) {
          setMessage(message);
          setTotal(0);
        } else {
          setProjects(projects);
          setTotal(totalCount);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [sample, teamName]);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const editProject = (id) => {
    dispatch(saveProId(id));
    let path = `/editProject`;
    history.push(path);
  };
  const completeProject = (id) => {
    const body = {
      status: "Finished",
    };
    return fetch(
      `/admin/team/update-project/${id}`,
      {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        setSample(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const deleteProject = (id) => {
    return fetch(
      `/admin/team/dissolve-team-project/${id}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        if (response.message) {
          showError(response.message);
        } else {
          var alreadyPresent = projects.filter(
            (member) => member.teamId !== id
          );
          setProjects(alreadyPresent);
          showSuccess("member deleted successfully");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const showSuccess = (success) => {
    toast.info(success, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  const showError = (error) => {
    toast.dark(error, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  const pagination = () => {
    if (teamName === "") {
      return (
        <TablePagination
          rowsPerPageOptions={[]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      );
    }
  };
  return (
    <div className="project">
      <div className="project__crd">
        <div className="project__row">
          <div className="project__selectRow">
            <div class="project__searchBox">
              <div class="project__searchField">
                <input
                  placeholder="Search by Team Name"
                  className="project__searchip"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                />
                <SearchRoundedIcon className="project__sicon" />
              </div>
            </div>
          </div>
          <div className="project__btn">
            <NavLink to="/addProject">
              <button className="project__addP">Add Project</button>
            </NavLink>
          </div>
        </div>

        <div className="project__cardRow">
          {message || projects.length === 0 ? (
            <span>no ongoing projects</span>
          ) : (
            projects.map((project, index) => (
              <div className="project__card">
                <div className="project__name">
                  <div className="project__pname">
                    {project.project.projectName}
                  </div>
                  <div className="project__dots">
                    <MoreVertIcon
                      onClick={() => {
                        index === 0
                          ? setShowChatOptions1(!showChatOptions1)
                          : setShowChatOptions2(!showChatOptions2);
                      }}
                    />
                  </div>
                  {(showChatOptions1 && index === 0) ||
                  (showChatOptions2 && index === 1) ? (
                    <div className="project__dropDown">
                      <div className="project__ede">
                        <div className="project__edit">
                          <button
                            onClick={() => editProject(project._id)}
                            className="project__ede"
                          >
                            <div className="project__edit">
                              <EditRoundedIcon className="project__icon" />
                              Edit
                            </div>
                          </button>
                          <hr />
                          <button
                            onClick={() => deleteProject(project._id)}
                            className="project__ede"
                          >
                            <div className="project__del">
                              <DeleteRoundedIcon className="project__icon" />
                              Delete
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
                <div class="project__body">
                  <div className="project__content">
                    <div className="project__subHead">Description</div>
                    <div className="project__span">
                      {project.project.description}
                    </div>
                  </div>
                  <div className="project__content">
                    <span className="project__subHead">Date of Deadline</span>
                    <span className="project__span">
                      {project.project.dateOfDeadline.substring(0, 10)}
                    </span>
                  </div>
                  <div className="project__content">
                    <span className="project__subHead"> Team Name</span>
                    <span className="project__span"> {project.teamName}</span>
                  </div>
                  <div className="project__content">
                    <span className="project__subHead"> Team Leader</span>
                    <span className="project__span">
                      {" "}
                      {project.teamLeader.firstName}
                    </span>
                  </div>
                  <div className="project__content">
                    <span className="project__subHead">Team Members</span>
                    {project.teamMembers.map((names) => (
                      <span className="project__span">{names.firstName}, </span>
                    ))}
                  </div>
                  <div className="project__content">
                    <span className="project__subHead">Status</span>
                    <div className="project__status">
                      {" "}
                      {project.project.status}
                    </div>
                  </div>
                  <div className="project__content">
                    <span className="project__subHead">Date Of Completion</span>
                    {project.project.dateOfCompletion ? (
                      <span className="project__span">
                        {project.project.dateOfCompletion.substring(0, 10)}
                      </span>
                    ) : (
                      <span className="project__span">DD-MM-YYYY</span>
                    )}
                  </div>
                  <div className="project__content">
                    <div>
                      <button
                        onClick={() => {
                          completeProject(project.project._id);
                        }}
                        className="project__done"
                      >
                        {project.project.dateOfCompletion ? (
                          <span className="project__span">Completed</span>
                        ) : (
                          <DoneRoundedIcon />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {pagination()}
        <ToastContainer />
      </div>
    </div>
  );
}

export default ProjectContent;
