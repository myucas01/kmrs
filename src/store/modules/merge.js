const getDefaultState = () => {
	return {
		questions: '',
		subjects: '',
		projects: ''
	};
};
let merge = {
	namespaced: true,
	state: getDefaultState(),
	mutations: {
		SET_MERGE_QUESTIONS: (state, data) => {
			state.questions = data;
		},
		SET_MERGE_SUBJECTS: (state, data) => {
			state.subjects = data;
		},
		SET_MERGE_PROJECTS: (state, data) => {
			state.projects = data;
		}
	},
	actions: {
		setMergeQuestions({
			commit
		}, data) {
			commit('SET_MERGE_QUESTIONS', data);
		},
		setMergeSubjects({
			commit
		}, data) {
			commit('SET_MERGE_SUBJECTS', data);
		},
		setMergeProjects({
			commit
		}, data) {
			commit('SET_MERGE_PROJECTS', data);
		}
	},
	getters: {
		questions: state => state.questions,
		subjects: state => state.subjects,
		projects: state => state.projects
	},
};

export default merge;
