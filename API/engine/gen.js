module.exports = {

    id: function() {
        ///TODO: proper id generation
        return (''+Math.random()).slice(2) + (''+Math.random()).slice(2);
    },

    spawnPoint: function(gameState) {
        return {
            x: Math.floor(Math.random() * gameState.map.w),
            y: Math.floor(Math.random() * gameState.map.h),
        };
    },

};
