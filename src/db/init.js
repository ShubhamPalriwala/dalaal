import pkg from 'mongoose';
const { connect } = pkg;

const connectToDb = (url) => {
    connect(url)
};

export default connectToDb;

