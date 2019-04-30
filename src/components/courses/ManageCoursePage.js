import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import * as courseActions from "../../redux/actions/courseActions";
import * as authorActions from "../../redux/actions/authorActions";
import PropTypes from "prop-types";
import CourseForm from "./CourseForm";
import { newCourse } from "../../../tools/mockData";
// import { bindActionCreators } from "redux";

function ManageCoursePage(props) {
  //Here we are using local state of component instead of redux
  const [course, setCourse] = useState({ ...props.course });
  const [errors, setErrors] = useState({});

  //Destructuring the props below so that these props will be used instead of the function sthat we have imported above. Function scopes will get precedence over module precedence
  const {
    courses,
    authors,
    loadAuthors,
    loadCourses,
    saveCourse,
    history
  } = props;

  //useEffect is hook introduced in 2019 to use hook functions inside function components
  // It is run everytime component is render but we want to run it only once when component is loaded
  // Pass second arugument which is an array and useEffect will be called when there is any change in the second argument.
  useEffect(() => {
    debugger;
    if (courses.length === 0) {
      loadCourses().catch(error => {
        alert("Loading courses failed" + error);
      });
    } else {
      setCourse({ ...props.course });
    }
    if (authors.length === 0) {
      loadAuthors().catch(error => {
        alert("Loading authors failed" + error);
      });
    }
  }, [props.course]);

  function handleChange(event) {
    const { name, value } = event.target;
    setCourse(prevCourse => ({
      ...prevCourse,
      //[name] is course.title
      [name]: name === "authorId" ? parseInt(value, 10) : value
    }));
  }
  function handleSave(event) {
    event.preventDefault();
    saveCourse(course).then(() => {
      //Change the react router history to change the url to /courses
      history.push("/courses");
    });
  }

  return (
    <>
      <CourseForm
        course={course}
        onChange={handleChange}
        errors={errors}
        authors={authors}
        onSave={handleSave}
      />
    </>
  );
}

ManageCoursePage.propTypes = {
  course: PropTypes.object.isRequired,
  authors: PropTypes.array.isRequired,
  courses: PropTypes.array.isRequired,
  // actions: PropTypes.object.isRequired
  loadAuthors: PropTypes.func.isRequired,
  loadCourses: PropTypes.func.isRequired,
  saveCourse: PropTypes.func.isRequired,
  // Any component loaded via <Route> gets history passed in props from React Router
  history: PropTypes.object.isRequired
};

export function getCourseBySlug(courses, slug) {
  return courses.find(course => course.slug === slug) || null;
}

function mapStateToProps(state, ownProps) {
  debugger;
  const slug = ownProps.match.params.slug;
  const course =
    slug && state.courses.length > 0
      ? getCourseBySlug(state.courses, slug)
      : newCourse;
  return {
    course: course,
    courses: state.courses,
    authors: state.authors
  };
}

const mapDispatchToProps = {
  loadAuthors: authorActions.loadAuthors,
  loadCourses: courseActions.loadCourses,
  saveCourse: courseActions.saveCourse
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageCoursePage);
