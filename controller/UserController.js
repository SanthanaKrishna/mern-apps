import { User } from '../models/User';

/**
 * @route ['GET'] api/users/:id
 * @query_param {id} req 
 * @desc    Get all users
 * @access  Private
 */
export const readUserDetails = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        // await User.findById(userId).select('-hashed_password');
        if (!user) throw Error('No users exist');
        user.hashed_password = undefined;
        user.salt = undefined;
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error });
    }
};


/**
 * @route ['PUT'] api/users/update/
 * @param {name, email} req 
 * @desc    update the given user data
 * @access  Private
 */
export const updateUserDetails = async (req, res) => {
    console.log('req.user', req.user, 'body', req.body);
    const { name, password } = req.body;
    try {
        // const user = await User.findById(req.user._id);
        const user = await User.findOne({ _id: req.user._id })
        if (!user) throw Error('User not found');

        if (!name) {
            return res.status(400).json({
                error: 'Name is required'
            });
        } else {
            user.name = name;
        }
        // if (!name) throw Error('Name is required');
        // user.name = name;
        if (password) {
            if (password.length < 6) {
                throw Error('Password should be min 6 character')
            } else {
                user.password = password;
            };
        }

        const updatedUser = await user.save();
        if (!updatedUser) throw Error('User Update failed');

        updatedUser.hashed_password = undefined;
        updatedUser.salt = undefined;
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: error });
    }
}